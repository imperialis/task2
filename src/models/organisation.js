// const { DataTypes } = require('sequelize');

// module.exports = (sequelize) => {
//   const Organisation = sequelize.define('Organisation', {
//     orgId: {
//       type: DataTypes.STRING,
//       primaryKey: true,
//       unique: true
//     },
//     name: {
//       type: DataTypes.STRING,
//       allowNull: false
//     },
//     description: {
//       type: DataTypes.STRING
//     }
//   });

//   return Organisation;
// };

const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize) => {
  const Organisation = sequelize.define('Organisation', {
    orgId: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING
    }
  });

  return Organisation;
};
