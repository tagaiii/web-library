import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User } from '../models/models.js'
import ApiError from '../error/ApiError.js'
import { Op } from 'sequelize'

const generateJwt = ({ id, email, role, first_name, last_name, avatar }) => {
  return jwt.sign(
    { id, email, role, first_name, last_name, avatar },
    process.env.SECRET_KEY,
    {
      expiresIn: '24h',
    }
  )
}

export const userRegistration = async (req, res, next) => {
  const { first_name, last_name, email, password, role } = req.body
  const avatar = req.file ? req.file.path.replace(/\\/g, '/') : null

  if (!email || !password) {
    return next(ApiError.badRequest('Некорректный email или password'))
  }
  const user = await User.findOne({ where: { email } })
  if (user) {
    return next(
      ApiError.badRequest('Пользователь с таким email уже существует')
    )
  }
  const hashPassword = await bcrypt.hash(password, 5)
  const new_user = await User.create({
    first_name,
    last_name,
    email,
    role,
    password: hashPassword,
    avatar,
  })
  const token = generateJwt({
    id: new_user.id,
    email: new_user.email,
    role: new_user.role,
    first_name: new_user.first_name,
    last_name: new_user.last_name,
    avatar: new_user.avatar,
  })
  return res.json({ token })
}

export const userLogin = async (req, res, next) => {
  const { email, password } = req.body
  const user = await User.findOne({ where: { email } })
  if (!user) {
    return next(ApiError.internal('Пользователь не найден'))
  }
  let comparePassword = bcrypt.compareSync(password, user.password)
  if (!comparePassword) {
    return next(ApiError.internal('Указан неверный пароль'))
  }
  const token = generateJwt({
    id: user.id,
    email: user.email,
    role: user.role,
    first_name: user.first_name,
    last_name: user.last_name,
    avatar: user.avatar,
  })
  return res.json({ token })
}

export const userAuth = async (req, res) => {
  const token = generateJwt({
    id: req.id,
    email: req.email,
    role: req.role,
    first_name: req.first_name,
    last_name: req.last_name,
    avatar: req.avatar,
  })
  return res.json({ token })
}

export const getUsersByRole = role => async (req, res, next) => {
  try {
    const { search } = req.query

    let whereCondition = {
      role,
    }

    if (search) {
      whereCondition = {
        ...whereCondition,
        [Op.or]: [
          { first_name: { [Op.like]: `%${search}%` } },
          { last_name: { [Op.like]: `%${search}%` } },
        ],
      }
    }

    const users = await User.findAll({
      where: whereCondition,
    })

    return res.json(users)
  } catch (error) {
    return next(
      ApiError.badRequest(`Не удалось найти пользователей с ролью ${role}`)
    )
  }
}
