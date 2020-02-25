import Sequelize from 'sequelize';
import User from '../app/models/User'; // as classes de tabelas
import databaseConfig from '../config/database'; // configuracao de coneccao

const models = [User]; // array com todos os models
class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    models.map(model => model.init(this.connection));
  }
}
export default new Database();
