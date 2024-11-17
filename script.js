const express = require('express');
const { DynamoDBClient, PutItemCommand, ScanCommand, UpdateItemCommand, DeleteItemCommand } = require('@aws-sdk/client-dynamodb');
const cors = require('cors');
require('dotenv').config();  // Cargar variables de entorno desde el archivo .env

const app = express();
app.use(cors());
app.use(express.json());

// Configuración del cliente DynamoDB con las variables de entorno
const dynamoClient = new DynamoDBClient({
  region: process.env.AWS_REGION,  // Usar la región desde las variables de entorno
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,  // Usar la clave de acceso de las variables de entorno
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,  // Usar la clave secreta de las variables de entorno
  },
});

const tableName = 'project-product-table';

// Obtener todos los productos
app.get('/productos', (req, res) => {
  const params = { TableName: tableName };
  const command = new ScanCommand(params);

  dynamoClient.send(command).then((data) => {
    res.json(data.Items);
  }).catch((err) => {
    console.error(err);
    res.status(500).send('Error al obtener productos');
  });
});

// Agregar un nuevo producto
app.post('/productos', (req, res) => {
  const { productId, name, description, price, quantity } = req.body;
  const params = {
    TableName: tableName,
    Item: {
      productId: { S: productId }, // DynamoDB requiere el tipo de dato en el valor
      name: { S: name },
      description: { S: description },
      price: { N: price }, // Asegúrate de que los números estén en formato de cadena
      quantity: { N: quantity },
    },
  };
  const command = new PutItemCommand(params);

  dynamoClient.send(command).then(() => {
    res.status(201).send('Producto creado');
  }).catch((err) => {
    console.error(err);
    res.status(500).send('Error al crear producto');
  });
});

// Actualizar un producto
app.put('/productos/:id', (req, res) => {
  const { id } = req.params;
  const { name, description, price, quantity } = req.body;

  const params = {
    TableName: tableName,
    Key: {
      productId: { S: id },
    },
    UpdateExpression: 'SET #n = :n, description = :d, price = :p, quantity = :q',
    ExpressionAttributeNames: {
      '#n': 'name',
    },
    ExpressionAttributeValues: {
      ':n': { S: name },
      ':d': { S: description },
      ':p': { N: price.toString() },
      ':q': { N: quantity.toString() },
    },
    ReturnValues: 'ALL_NEW',
  };
  
  const command = new UpdateItemCommand(params);

  dynamoClient.send(command).then((data) => {
    res.json(data.Attributes); // Devuelve los nuevos valores actualizados
  }).catch((err) => {
    console.error('Error al actualizar producto:', err);
    res.status(500).send('Error al actualizar producto');
  });
});

// Eliminar un producto
app.delete('/productos/:id', (req, res) => {
  const { id } = req.params;

  const params = {
    TableName: tableName,
    Key: {
      productId: { S: id },
    },
  };

  const command = new DeleteItemCommand(params);

  dynamoClient.send(command).then(() => {
    res.send('Producto eliminado exitosamente');
  }).catch((err) => {
    console.error('Error al eliminar producto:', err);
    res.status(500).send('Error al eliminar producto');
  });
});

app.listen(3000, () => console.log('Server running on port 3000'));
