// import DB from 'mssql'
// const sqlConfig: DB.config = {
//     user: 'hesam',
//     password: 'hesam2035',
//     database: 'IranaMaindb',
//     port:1433,
//     server: 'localhost',
//     options: {
//       encrypt: true, // for azure
//       trustServerCertificate: true // change to true for local dev / self-signed certs
//     },
//     requestTimeout: 30000,
//   };

//   const appPool = new DB.ConnectionPool(sqlConfig)

//   const sql = (name: string, params?: object | undefined | null) =>
//     new Promise((resolve, reject)=> {
//       appPool.connect().then((pool: DB.ConnectionPool) => {
//         let query = name;
//         if (params) {
//           query +=
//            " " +
//            Object.keys(params)
//            .map(
//            (key) =>
//             `@${key}=${typeof params[key as keyof typeof params] == "string"
//                 ? "N'" + params[key as keyof typeof params] + "'"
//                 : params[key as keyof typeof params]
//             }`
//            )
//            .join(", ");
//         }
//         pool  
//           .query(query)
//           .then((res) => {
//             resolve(res.recordset);
//           })
//           .catch((err) => {
//             reject(err);
//           });
//       });
//     });  
// export {sql};   