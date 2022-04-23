const mongoose = require('mongoose');
const app = require('./app');
const Admin=require('./src/controllers/InicioController')

mongoose.Promise = global.Promise;

mongoose
  .connect('mongodb://localhost:27017/Sucursales', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Se encuentra conectado a la base de datos.');

    app.listen(3000, function () {
      console.log('Hola IN6BM, esta corriendo en el puerto 3000');
    });
  })
  .catch((error) => console.log(error));

Admin.Admin()