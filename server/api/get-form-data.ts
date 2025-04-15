// server/api/get-form-data.ts

import sql from 'mssql'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const fullToken = query.token

  if (!fullToken || typeof fullToken !== 'string') {
    return { error: 'توکن ارسال نشده است' }
  }

  const tokenPart = fullToken.slice(0, 12)
  const estelamPart = fullToken.slice(13)

  const pool = await sql.connect({
    server: 'localhost',
    database: 'SendIranadb',
    user: 'hesam',
    password: 'hesam2035',
    options: {
      trustServerCertificate: true
    }
  })

  const mLinkResult = await pool
    .request()
    .input('xLink', sql.NVarChar, tokenPart)
    .input('xEstelam', sql.Int, parseInt(estelamPart))
    .query(`
      SELECT * FROM dbo.mLink
      WHERE xLink_ = @xLink AND xEstelam_ = @xEstelam AND xIsActive_ = 0
    `)

  if (mLinkResult.recordset.length === 0) {
    return { error: 'رکورد معتبر پیدا نشد یا قبلاً ثبت شده' }
  }

  const xSeller = mLinkResult.recordset[0].xSeller_
  const xEstelam = mLinkResult.recordset[0].xEstelam_

  const senResult = await pool
    .request()
    .input('xSeller', sql.NVarChar, xSeller)
    .input('xEstelam', sql.Int, xEstelam)
    .query(`
      SELECT xKala_, xBrand_, xNerkh_, xModat_, xSharh_
      FROM dbo.mSenEstelam
      WHERE xSeller_ = @xSeller AND xEstelam_ = @xEstelam
    `)

  return {
    estelam: xEstelam,
    seller: xSeller,
    token: tokenPart,
    items: senResult.recordset
  }
})