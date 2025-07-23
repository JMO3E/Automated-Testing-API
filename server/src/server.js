import app from './app.js';
import sequelize from './config/mysql.database.js';

sequelize.sync({ force: false })
  .then(() => {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('Error syncing database:', err);
  });