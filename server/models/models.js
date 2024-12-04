import sequelize from '../db.js'
import { DataTypes } from 'sequelize'

export const User = sequelize.define('user', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  first_name: { type: DataTypes.STRING, allowNull: false },
  last_name: { type: DataTypes.STRING, allowNull: false },
  avatar: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING },
  role: { type: DataTypes.STRING, defaultValue: 'USER' },
})

export const Author = sequelize.define('author', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  full_name: { type: DataTypes.STRING, allowNull: false },
})

export const Category = sequelize.define('category', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, unique: true, allowNull: false },
})

export const Faculty = sequelize.define('faculty', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, unique: true, allowNull: false },
})

export const FacultyDept = sequelize.define('faculty_dept', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, unique: true, allowNull: false },
  faculty_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Faculty,
      key: 'id',
    },
    allowNull: false,
  },
})

export const Book = sequelize.define('book', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  inv_id: { type: DataTypes.INTEGER, unique: true, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
  cover_image: { type: DataTypes.STRING, allowNull: false },
  year: { type: DataTypes.INTEGER },
  publisher: { type: DataTypes.STRING },
  city: { type: DataTypes.STRING },
  annotation: { type: DataTypes.TEXT },
  isbn: { type: DataTypes.STRING },
  author_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Author,
      key: 'id',
    },
    allowNull: false,
  },
  category_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Category,
      key: 'id',
    },
    allowNull: false,
  },
  faculty_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Faculty,
      key: 'id',
    },
    allowNull: false,
  },
  faculty_dept_id: {
    type: DataTypes.INTEGER,
    references: {
      model: FacultyDept,
      key: 'id',
    },
    allowNull: false,
  },
  qr_code: { type: DataTypes.STRING, unique: true, allowNull: false },
  barcode: { type: DataTypes.STRING, unique: true, allowNull: false },
})

Book.belongsTo(User, { foreignKey: 'taken_by_id', as: 'reader' })
User.hasMany(Book, { foreignKey: 'taken_by_id', as: 'books_taken' })

Book.belongsTo(User, { foreignKey: 'added_by_id', as: 'librarian' })
User.hasMany(Book, { foreignKey: 'added_by_id', as: 'books_added' })

Book.belongsTo(Author, { foreignKey: 'author_id', as: 'author' })
Author.hasMany(Book, { foreignKey: 'author_id', as: 'books' })

Category.hasMany(Book, { foreignKey: 'category_id', as: 'books' })
Book.belongsTo(Category, { foreignKey: 'category_id', as: 'category' })

Faculty.hasMany(Book, { foreignKey: 'faculty_id', as: 'books' })
Book.belongsTo(Faculty, { foreignKey: 'faculty_id', as: 'faculty' })

Faculty.hasMany(FacultyDept, { foreignKey: 'faculty_id', as: 'departments' })
FacultyDept.belongsTo(Faculty, { foreignKey: 'faculty_id', as: 'faculty' })

FacultyDept.hasMany(Book, { foreignKey: 'faculty_dept_id', as: 'books' })
Book.belongsTo(FacultyDept, {
  foreignKey: 'faculty_dept_id',
  as: 'faculty_dept',
})
