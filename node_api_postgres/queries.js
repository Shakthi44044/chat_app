const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'chat_app',
  password: 'Shakthiopen12@',
  port: 5432,
})
const bcrypt = require('bcrypt');
const saltRounds = 10;

async function hashPassword(password) {
 try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
 } catch (error) {
    console.error(error);
 }
}
const getUsers = (request, response) => {
  pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}


const createUser = async (request, response) => {
  const { name, email, id, password } = request.body;
 
  try {
     const hashedPassword = await hashPassword(password);
     pool.query('INSERT INTO users (name, email, id, password) VALUES ($1, $2, $3, $4)', [name, email, id, hashedPassword], (error, results) => {
       if (error) {
         throw error;
       }
       response.status(201).send(`User added with ID: ${results.insertId}`);
     });
  } catch (error) {
     console.error(error);
     response.status(500).send('Error creating user');
  }
 };

const updateUser = (request, response) => {
  const id = parseInt(request.params.id)
  const { name, email } = request.body

  pool.query(
    'UPDATE users SET name = $1, email = $2 WHERE id = $3',
    [name, email, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User modified with ID: ${id}`)
    }
  )
}

const deleteUser = (request, response) => {
  const id = parseInt(request.params.id)
 
  console.log(`Attempting to delete user with ID: ${id}`);
 
  pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
     if (error) {
       console.error(`Error deleting user with ID: ${id}`, error);
       throw error
     }
     console.log(`User deleted with ID: ${id}`);
     response.status(200).send(`User deleted with ID: ${id}`)
  })
 }
module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
}