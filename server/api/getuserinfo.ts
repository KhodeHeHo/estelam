import sql from 'mssql';

const config = {
  user: 'hesam',
  password: 'hesam2035',
  server: 'localhost',
  database: 'SendIranadb',
  options: {
    trustServerCertificate: true,
  },
};

export default defineEventHandler(async (ev) => {
  const token = await sql.query (ev.token as string);

  if (!token) {
    return { error: 'توکن موجود نیست' };
  }

  try {
    const pool = await sql.connect(config);

    const result = await pool
      .request()
      .input('token', sql.VarChar, token)
      .query(`
        SELECT xsellerName_, xisactive_, xKalaName_
        FROM xestelam
        WHERE xlink = @token
      `);

    if (result.recordset.length === 0) {
      return { error: 'لینک معتبر نیست' };
    }

    const row = result.recordset[0];

    return {
      name: row.xseller_,
      isSubmitted: row.xIsActive_,
      products: JSON.parse(row.xKala_),
    };
  } catch (err) {
    return { error: 'خطا در ارتباط با دیتابیس',  };
  }
});

function defineEventHandler(arg0: (event: any) => Promise<{ error: string; name?: undefined; isSubmitted?: undefined; products?: undefined; } | { name: any; isSubmitted: any; products: any; error?: undefined; }>) {
    throw new Error('Function not implemented.');
}
function getQuery(event: any) {
    throw new Error('Function not implemented.');
}

