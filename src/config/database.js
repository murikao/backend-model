module.exports = {
  // lido pelo sequelize presiza dest sintaxe
  dialect: 'postgres',
  host: '192.168.0.28', // 'localhost', no meu caso esta no docker do servidor
  username: 'murikao', //  normal eh postgres',
  password: 'docker', // meu tb eh docker cf imagem
  database: 'gobarber', // vai depender do projeto
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};

/*  underscored: true,
UserGroup
  UserGroups
  ## usa nas tabelas names no formato underscore em vez de cammelCase
  user-groups */
