import sql from 'mssql'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { token, items } = body 

  if (!token || !Array.isArray(items) || items.length === 0) {
    return { error: 'اطلاعات ناقص است' }
  }

  const pool = await sql.connect({
    server: 'localhost',
    database: 'SendIranadb',
    user: 'hesam',
    password: 'hesam2035',
    options: {
      trustServerCertificate: true
    }
  })

  const errors = []

  for (const entry of items) {
    const { item, price, brand, delivery, description } = entry

    if (!item) continue

    // بررسی اینکه قبلاً ثبت نشده باشه
    const check = await pool
      .request()
      .input('token', sql.NVarChar, token)
      .input('item', sql.NVarChar, item)
      .query('SELECT * FROM xestelam WHERE xlink = @token AND xstuff = @item AND xisactive = 0')

    if (check.recordset.length === 0) {
      errors.push ("کالا '${item}' قبلاً ثبت شده یا معتبر نیست.")
      continue
    }

    // ثبت یا آپدیت اطلاعات
    await pool
      .request()
      .input('token', sql.NVarChar, token)
      .input('item', sql.NVarChar, item)
      .input('price', sql.NVarChar, price || '')
      .input('brand', sql.NVarChar, brand || '')
      .input('delivery', sql.NVarChar, delivery || '')
      .input('description', sql.NVarChar, description || '')
      .query(`
        UPDATE xestelam SET
          price = @price,
          brand = @brand,
          delivery = @delivery,
          description = @description,
          xisactive = 1
        WHERE xlink = @token AND xstuff = @item
      `)
  }

  if (errors.length > 0) {
    return { message: 'برخی از موارد ثبت نشدند', errors }
  }

  return { message: 'اطلاعات با موفقیت ثبت شد' }
})