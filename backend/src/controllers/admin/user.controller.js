const prisma      = require('../../config/prismaClient');
const { hash }    = require('../../utils/password');
const audit       = require('../../utils/audit');
const { ROLES }   = require('../../utils/roles');

/*  GET /admin/users */
async function list(req, res) {
  const { role, deleted } = req.query;
  const where = {
    ...(role && { role }),
    ...(deleted && { isDeleted: deleted === 'true' })
  };
  const users = await prisma.user.findMany({ where });
  res.json(users);
}

/*  POST /admin/users */
async function create(req, res) {
  const { email, password, firstName='', lastName='', role='STUDENT' } = req.body;
  if (!email || !password) return res.status(400).json({ message:'Email & password required' });
  if (!ROLES.includes(role)) return res.status(400).json({ message:'Bad role' });

  const exists = await prisma.user.findUnique({ where:{ email } });
  if (exists) return res.status(409).json({ message:'Email already exists' });

  const user = await prisma.user.create({
    data:{ email, password: await hash(password), firstName, lastName, role }
  });
  audit(req.user.id, 'CREATE_USER', { target:user.id });
  res.status(201).json(user);
}

/*  PATCH /admin/users/:id */
async function update(req, res) {
  const id = +req.params.id;
  const { firstName, lastName, isDeleted, role } = req.body;
  const user = await prisma.user.update({
    where:{ id },
    data :{ firstName, lastName, isDeleted, role }
  });
  audit(req.user.id, 'UPDATE_USER', { target:id, diff:req.body });
  res.json(user);
}

/*  DELETE /admin/users/:id  (hard delete) */
async function remove(req, res) {
  const id = +req.params.id;
  await prisma.user.delete({ where:{ id } });
  audit(req.user.id, 'DELETE_USER', { target:id });
  res.json({ success:true });
}

module.exports = { list, create, update, remove };
