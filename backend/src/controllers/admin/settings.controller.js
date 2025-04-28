const prisma = require('../../config/prismaClient');
const audit  = require('../../utils/audit');

/* GET /admin/settings */
async function list(req,res){
  const rows = await prisma.appSetting.findMany();
  res.json(Object.fromEntries(rows.map(r=>[r.key, r.value])));
}

/* PATCH /admin/settings */
async function update(req,res){
  const entries = Object.entries(req.body);         // { maintenance:true }
  await prisma.$transaction(entries.map(([k,v]) =>
    prisma.appSetting.upsert({
      where :{ key:k },
      create:{ key:k, value:String(v) },
      update:{ value:String(v) }
    })
  ));
  audit(req.user.id,'UPDATE_SETTINGS', req.body);
  res.json({ success:true });
}

module.exports = { list, update };
