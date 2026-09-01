import express from 'express'

const app = express()
app.get('/', (req, res) => {
    res.send('backend do HelpDesk funcionando!')
})

app.listen(3000, () => {
    console.log('servidor rodando na porta 3000')
})