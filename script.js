const express = require('express');
const AWS = require('aws-sdk');

const app = express();
app.use(express.json());

const dynamoClient = new AWS.DynamoDB.DocumentClient({
  region: 'us-east-1', // Cambia según tu región
});
const tableName = 'project-product-table';

// Obtener todos los productos
app.get('/api/productos', async (req, res) => {
  const params = { TableName: tableName };
  try {
    const data = await dynamoClient.scan(params).promise();
    res.json(data.Items);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener productos');
  }
});

// Agregar un nuevo producto
app.post('/api/productos', async (req, res) => {
  const { productId, name, description, price, quantity } = req.body;
  const params = {
    TableName: tableName,
    Item: { productId, name, description, price, quantity },
  };
  try {
    await dynamoClient.put(params).promise();
    res.status(201).send('Producto creado');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al crear producto');
  }
});

// Actualizar un producto
app.put('/api/productos/:id', (req, res) => {
    const { id } = req.params;
    const { name, description, price, quantity } = req.body;
  
    const params = {
      TableName: tableName,
      Key: { productId: id },
      UpdateExpression: 'set #n = :n, description = :d, price = :p, quantity = :q',
      ExpressionAttributeNames: { '#n': 'name' },
      ExpressionAttributeValues: {
        ':n': name,
        ':d': description,
        ':p': price,
        ':q': quantity,
      },
      ReturnValues: 'UPDATED_NEW',
    };
  
    dynamoClient.update(params, (err, data) => {
      if (err) {
        console.error('Error al actualizar producto:', err);
        res.status(500).send('Error al actualizar producto');
      } else {
        res.json(data.Attributes); // Devuelve los nuevos valores actualizados
      }
    });
  });

  // Eliminar un producto
app.delete('/api/productos/:id', (req, res) => {
    const { id } = req.params;
  
    const params = {
      TableName: tableName,
      Key: { productId: id },
    };
  
    dynamoClient.delete(params, (err, data) => {
      if (err) {
        console.error('Error al eliminar producto:', err);
        res.status(500).send('Error al eliminar producto');
      } else {
        res.send('Producto eliminado exitosamente');
      }
    });
  });
  

app.listen(3000, () => console.log('Server running on port 3000'));
