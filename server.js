const express = require('express');
const fs = require('fs').promises;
const bcrypt = require('bcrypt');

const app = express();
const PORT = 3000;
const DB_FILE = 'assign.json';

app.use(express.json());

app.post('/assign', async (req, res) => {
  const { username, emailId, password } = req.body;

  if (!username || !emailId || !password) {
    return res.status(400).json({ message: 'All fields required' });
  }

  const users = JSON.parse(await fs.readFile(DB_FILE, 'utf-8').catch(() => '[]'));

  if (users.find(u => u.emailId === emailId)) {
    return res.status(400).json({ message: 'Email already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id: users.length + 1,
    username,
    emailId,
    password: hashedPassword
  };

  users.push(newUser);
  await fs.writeFile(DB_FILE, JSON.stringify(users, null, 2));

  res.status(201).json({ message: 'User registered', userId: newUser.id });
});

app.listen(PORT, () => {
  console.log('connected successfully');
});
