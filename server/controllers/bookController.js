import {
  Book,
  Author,
  Faculty,
  FacultyDept,
  Category,
} from '../models/models.js'

import ApiError from '../error/ApiError.js'

export const getBooks = async (req, res, next) => {
  try {
    const books = await Book.findAll()
    return res.json(books)
  } catch (error) {
    return next(ApiError.internal('Ошибка при получении данных!'))
  }
}

export const getBookById = async (req, res, next) => {
  const { id } = req.params
  try {
    const book = await Book.findByPk(id)
    return res.json(book)
  } catch (error) {
    return next(ApiError.badRequest('Книга не найдена'))
  }
}

export const getBookByTitle = async (req, res, next) => {
  const { title } = req.query
  try {
    const book = await Book.findOne({ where: { title } })
    return res.json(book)
  } catch (error) {
    return next(ApiError.badRequest('Книга не найдена!'))
  }
}

export const addBook = async (req, res, next) => {
  const {
    inv_id,
    title,
    annotation,
    year,
    publisher,
    city,
    isbn,
    authorId,
    authorName,
    facultyId,
    facultyTitle,
    facultyDeptId,
    facultyDeptTitle,
    categoryId,
    categoryTitle,
    qr_code,
    barcode,
  } = req.body

  const cover_image = req.file ? req.file.path.replace(/\\/g, '/') : null
  const librarianId = req.user.id

  try {
    let author
    if (authorId) {
      author = await Author.findByPk(authorId)
    } else if (authorName) {
      author = await Author.create({ full_name: authorName })
    }

    let category
    if (categoryId) {
      category = await Category.findByPk(categoryId)
    } else if (categoryTitle) {
      category = await Category.create({ title: categoryTitle })
    }

    let faculty
    if (facultyId) {
      faculty = await Faculty.findByPk(facultyId)
    } else if (facultyTitle) {
      faculty = await Faculty.create({ title: facultyTitle })
    }

    let facultyDept
    if (facultyDeptId) {
      facultyDept = await FacultyDept.findByPk(facultyDeptId)
    } else if (facultyDeptTitle && faculty) {
      facultyDept = await FacultyDept.create({
        title: facultyDeptTitle,
        faculty_id: faculty.id,
      })
    }

    const newBook = await Book.create({
      title,
      cover_image,
      inv_id,
      annotation,
      year,
      publisher,
      city,
      isbn,
      author_id: author.id,
      category_id: category.id,
      faculty_id: faculty.id,
      faculty_dept_id: facultyDept.id,
      added_by_id: librarianId,
      qr_code,
      barcode,
    })
    res.json(newBook)
  } catch (error) {
    return next(ApiError.internal('Ошибка при добавлении книги!'))
  }
}

export const deleteBook = async (req, res, next) => {
  const { id } = req.params
  try {
    const book = await Book.findByPk(id)
    if (!book) {
      return next(ApiError.badRequest('Книга не найдена!'))
    }
    await book.destroy()
    return res.status(204).send()
  } catch (error) {
    return next(ApiError.internal('Не удалось удалить книгу!'))
  }
}

export const editBook = async (req, res, next) => {
  const { id } = req.params
  const {
    title,
    inv_id,
    annotation,
    year,
    publisher,
    city,
    isbn,
    authorId,
    authorName,
    facultyId,
    facultyTitle,
    facultyDeptId,
    facultyDeptTitle,
    categoryId,
    categoryTitle,
    qr_code,
    barcode,
  } = req.body
  try {
    const book = await Book.findByPk(id)
    if (!book) {
      return next(ApiError.badRequest('Книга не найдена'))
    }

    let author
    if (authorId) {
      author = await Author.findByPk(authorId)
    } else if (authorName) {
      author = await Author.create({ full_name: authorName })
    }

    let category
    if (categoryId) {
      category = await Category.findByPk(categoryId)
    } else if (categoryTitle) {
      category = await Category.create({ title: categoryTitle })
    }

    let faculty
    if (facultyId) {
      faculty = await Faculty.findByPk(facultyId)
    } else if (facultyTitle) {
      faculty = await Faculty.create({ title: facultyTitle })
    }

    let facultyDept
    if (facultyDeptId) {
      facultyDept = await FacultyDept.findByPk(facultyDeptId)
    } else if (facultyDeptTitle && faculty) {
      facultyDept = await FacultyDept.create({
        title: facultyDeptTitle,
        faculty_id: faculty.id,
      })
    }
    const cover_image = req.file
      ? req.file.path.replace(/\\/g, '/')
      : book.cover_image

    await book.update({
      title: title || book.title,
      cover_image: cover_image,
      inv_id: inv_id || book.inv_id,
      annotation: annotation || book.annotation,
      year: year || book.year,
      publisher: publisher || book.publisher,
      city: city || book.city,
      isbn: isbn || book.isbn,
      qr_code: qr_code || book.qr_code,
      barcode: barcode || book.barcode,
      author_id: author ? author.id : book.author_id,
      category_id: category ? category.id : book.category_id,
      faculty_id: faculty ? faculty.id : book.faculty_id,
      faculty_dept_id: facultyDept ? facultyDept.id : book.faculty_dept_id,
    })
    res.json({ message: 'Книга успешно обновлена!', book })
  } catch (error) {
    return next(ApiError.internal('Не удалось обновить книгу'))
  }
}

export const assignBook = async (req, res, next) => {
  const { id } = req.params
  const { readerId } = req.body
  try {
    const book = await Book.findByPk(id)
    book.taken_by_id = readerId
    await book.save()

    res.json(book)
  } catch (error) {
    console.log(error)
    return next(ApiError.internal('Не удалось привязать книгу'))
  }
}

export const returnBook = async (req, res, next) => {
  const { id } = req.params
  try {
    const book = Book.findByPk(id)
    book.taken_by_id = null
    await book.save()

    return res.json(book)
  } catch (error) {
    return next(ApiError.internal('Не удалось провести операцию'))
  }
}
