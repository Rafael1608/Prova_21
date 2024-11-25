const express = require('express');
const app = express();

app.use(express.json());

// Listas para armazenar dados em memória
let users = [];
let userId = 1;

let products = [];
let productId = 1;

// validação
const validateUser = (user) => {
  const errors = [];
  if (!user.name || user.name.length < 3) errors.push("'Nome' deve conter no mínimo 3 caracteres");
  if (user.name && user.name.length > 150) errors.push("'Nome' deve conter no máximo 150 caracteres");
  if (!user.cpf || user.cpf.length !== 11 || !/^\d+$/.test(user.cpf)) errors.push("'Cpf' deve conter 11 caracteres numéricos");
  if (!user.email || user.email.length < 3) errors.push("'Email' deve conter no mínimo 3 caracteres");
  if (user.email && user.email.length > 100) errors.push("'Email' deve conter no máximo 100 caracteres");
  if (!user.email.includes('@') || !user.email.split('@')[1].includes('.')) errors.push("'Email' deve conter '@' e '.' após o '@'");
  return errors;
};

const validateProduct = (product) => {
  const errors = [];
  if (!product.name || product.name.length < 3) errors.push("'Nome' deve conter no mínimo 3 caracteres");
  if (product.name && product.name.length > 100) errors.push("'Nome' deve conter no máximo 100 caracteres");
  if (product.price == null || product.price <= 0) errors.push("'Preço deve ser maior que 0'");
  return errors;
};

// Endpoints de Usuários
app.get('/users', (req, res) => res.json(users));

app.post('/users', (req, res) => {
  const errors = validateUser(req.body);
  if (errors.length) return res.status(400).json({ errors });

  const newUser = { id: userId++, ...req.body };
  users.push(newUser);
  res.json({ message: 'Usuário cadastrado com sucesso' });
});

app.get('/users/:id', (req, res) => {
  const user = users.find(u => u.id == req.params.id);
  if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });
  res.json(user);
});

app.put('/users/:id', (req, res) => {
  const user = users.find(u => u.id == req.params.id);
  if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

  const errors = validateUser(req.body);
  if (errors.length) return res.status(400).json({ errors });

  Object.assign(user, req.body);
  res.json({ message: 'Usuário atualizado com sucesso' });
});

app.delete('/users/:id', (req, res) => {
  const userIndex = users.findIndex(u => u.id == req.params.id);
  if (userIndex === -1) return res.status(404).json({ message: 'Usuário não encontrado' });

  users.splice(userIndex, 1);
  res.json({ message: 'Usuário removido com sucesso' });
});

// Endpoints de Produtos
app.get('/products', (req, res) => res.json(products));

app.post('/products', (req, res) => {
  const errors = validateProduct(req.body);
  if (errors.length) return res.status(400).json({ errors });

  const newProduct = { id: productId++, ...req.body };
  products.push(newProduct);
  res.json({ message: 'Produto cadastrado com sucesso' });
});

app.get('/products/:id', (req, res) => {
  const product = products.find(p => p.id == req.params.id);
  if (!product) return res.status(404).json({ message: 'Produto não encontrado' });
  res.json(product);
});

app.put('/products/:id', (req, res) => {
  const product = products.find(p => p.id == req.params.id);
  if (!product) return res.status(404).json({ message: 'Produto não encontrado' });

  const errors = validateProduct(req.body);
  if (errors.length) return res.status(400).json({ errors });

  Object.assign(product, req.body);
  res.json({ message: 'Produto atualizado com sucesso' });
});

app.delete('/products/:id', (req, res) => {
  const productIndex = products.findIndex(p => p.id == req.params.id);
  if (productIndex === -1) return res.status(404).json({ message: 'Produto não encontrado' });

  products.splice(productIndex, 1);
  res.json({ message: 'Produto removido com sucesso' });
});

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});