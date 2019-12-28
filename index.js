const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const sqlite = require('sqlite')
const dbConnection = sqlite.open('banco.sqlite', { Promise })

app.set('view engine', 'ejs')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', async (req, res) => {
	const db = await dbConnection
	const categoriasDB = await db.all('select * from categorias')
	const vagas = await db.all('select * from vagas;')
	const categorias = categoriasDB.map(cat => {
		return  {
			...cat,
			vagas: vagas.filter(vaga => vaga.categoria === cat.id)
		}
	})
	res.render('home', {
		categorias
	})
})

app.get('/admin', async (req, res) => {
	res.render('admin/home')
})

app.get('/admin/categorias', async (req, res) => {
	const db = await dbConnection
	const categorias = await db.all('select * from categorias')
	res.render('admin/categorias', {
		categorias
	})
})

app.get('/admin/categorias/delete/:id', async (req, res) => {
	const db = await dbConnection
	await db.run('delete from categorias where id = ' + req.params.id)
	res.redirect('/admin/categorias')
})

app.get('/admin/categorias/nova', async (req, res) => {
	res.render('admin/nova-categoria')
})

app.get('/admin/categorias/edit/:id', async (req, res) => {
	const db = await dbConnection
	const categoria = await db.get('select * from categorias where id = ' + req.params.id)
	res.render('admin/edit-categoria', {
		categoria
	})
})

app.post('/admin/categorias/nova', async (req, res) => {
	const db = await dbConnection
	const { categoria } = req.body

	await db.run(`insert into categorias(categoria) values('${categoria}');`)
	res.redirect('/admin/categorias')
})

app.post('/admin/categorias/edit/:id', async (req, res) => {
	const db = await dbConnection
	const { titulo, descricao, categoria } = req.body

	await db.run(`update categorias set categoria = '${categoria}' where id = ${req.params.id};`)
	res.redirect('/admin/categorias')
})

app.get('/admin/vagas', async (req, res) => {
	const db = await dbConnection
	const vagas = await db.all('select * from vagas;')
	res.render('admin/vagas', {
		vagas
	})
})


app.get('/admin/vagas/delete/:id', async (req, res) => {
	const db = await dbConnection
	await db.run('delete from vagas where id = ' + req.params.id)
	res.redirect('/admin/vagas')
})

app.get('/admin/vagas/nova', async (req, res) => {
	const db = await dbConnection
	const categorias = await db.all('select * from categorias')
	res.render('admin/nova-vaga', {
		categorias
	})
})

app.get('/admin/vagas/edit/:id', async (req, res) => {
	const db = await dbConnection
	const vaga = await db.get('select * from vagas where id = ' + req.params.id)
	const categorias = await db.all('select * from categorias')
	res.render('admin/edit-vaga', {
		categorias,
		vaga
	})
})

app.post('/admin/vagas/nova', async (req, res) => {
	const db = await dbConnection
	const { titulo, descricao, categoria } = req.body

	await db.run(`insert into vagas(titulo, descricao, categoria) values('${titulo}', '${descricao}', ${categoria});`)
	res.redirect('/admin/vagas')
})

app.post('/admin/vagas/edit/:id', async (req, res) => {
	const db = await dbConnection
	const { titulo, descricao, categoria } = req.body

	await db.run(`update vagas set titulo = '${titulo}', descricao = '${descricao}', categoria = ${categoria} where id = ${req.params.id};`)
	res.redirect('/admin/vagas')
})

app.get('/vaga/:id', async (req, res) => {
	const db = await dbConnection
	const vaga = await db.get('select * from vagas where id = ' + req.params.id)
	res.render('vaga', {
		vaga
	})
})

app.get('/curriculo', (req, res) => {
	res.render('curriculo')
})

/*const init = async () => {
	const db = await dbConnection
	await db.run('create table if not exists categorias(id INTEGER PRIMARY KEY, categoria TEXT);')
}

init()*/

app.listen(3000, (err) => {
	if (err) {
		console.log('Não foi possivél rodar servidor jobyfy')
	} else {
		console.log('Servidor do Jobify rodando')
	}
})