const express = require("express")
const uuid = require('uuid')
const port = 3000
const app = express()
app.use(express.json())

const orders = []

const checkOrderID = (request, response, next) => {
    const { id } = request.params

    const index = orders.findIndex(menu => menu.id === id)

    if (index < 0) {
        return response.status(404).json({ error: "Order not found" })
    }

    request.menuIndex = index
    request.menuId = id


    next()
}

const checkOrderStatus = (request, response, next) => {

    console.log(`Método: ${request.method}, URL: ${request.originalUrl}`)

    next() // Chama o próximo middleware na cadeia
}

app.get('/orders', checkOrderStatus, (request, response) => {

    return response.json(orders)
})

app.post('/orders', checkOrderStatus, (request, response) => {
    const { order, clientName, price } = request.body
    const status = "Em preparação"

    const menu = { id: uuid.v4(), order, clientName, price, status }

    orders.push(menu)

    return response.status(201).json(menu)
})

app.put('/orders/:id', checkOrderID, checkOrderStatus, (request, response) => {

    const { order, clientName, price } = request.body
    const index = request.menuIndex
    const id = request.menuId
    const status = "Em preparação"

    const updatedOrder = { id, order, clientName, price, status }

    orders[index] = updatedOrder

    return response.json(updatedOrder)

})

app.delete('/orders/:id', checkOrderID, checkOrderStatus, (request, response) => {
    const index = request.menuIndex

    orders.splice(index, 1)

    return response.status(204).json()
})

app.patch('/orders/:id', checkOrderID, checkOrderStatus, (request, response) => {

    const index = request.menuIndex
    const id = request.menuId

    if (index !== -1) {
        orders[index].status = "Pronto"
        response.json({ message: `Status do pedido ${id} alterado para 'Pronto'` })
    } else {
        response.status(404).json({ error: `Pedido com ID ${id} não encontrado` })
    }


})


/*
const { order, clientName, price } = request.body
const index = request.menuIndex
const id = request.menuId
const status = "Pronto"
 


const updatedOrder = { id, order, clientName, price, status }

orders[index] = updatedOrder

return response.json(updatedOrder)
})
*/

app.listen(port, () => {
    console.log(`😎😎😎Server started on port ${port}`)
})






