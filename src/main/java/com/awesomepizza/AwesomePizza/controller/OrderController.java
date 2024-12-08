package com.awesomepizza.AwesomePizza.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.awesomepizza.AwesomePizza.entity.Order;
import com.awesomepizza.AwesomePizza.entity.Pizza;
import com.awesomepizza.AwesomePizza.model.CreateOrderRequest;
import com.awesomepizza.AwesomePizza.model.OrderModel;
import com.awesomepizza.AwesomePizza.repository.OrderRepository;
import com.awesomepizza.AwesomePizza.repository.PizzaRepository;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private PizzaRepository pizzaRepository;

    // GET - Recupera tutti gli ordini
    @GetMapping
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    // GET - Ordini evasi
    @GetMapping("/status/2")
    public List<Order> getOrdersByStatus() {
        return orderRepository.findByStatus(2);
    }

    // POST - Crea un nuovo ordine
    @PostMapping("/create")
    public Order createOrder(@RequestBody CreateOrderRequest request) {
        List<Pizza> pizzas = request.getPizzaIds().stream()
            .map(pizzaId -> pizzaRepository.findById(pizzaId)
                .orElseThrow(() -> new IllegalArgumentException("Pizza not found with ID: " + pizzaId)))
            .collect(Collectors.toList());
    
        Order newOrder = new Order();
        newOrder.setStatus(request.getStatus());
        newOrder.setNickname(request.getNickname());
        newOrder.setPizzas(pizzas);
    
        return orderRepository.save(newOrder);
    }
    

    // PUT - Aggiorna un ordine
    @PutMapping("/{id}")
    public Order updateOrder(@PathVariable Long id, @RequestBody OrderModel orderDetails) {
        Order order = orderRepository.findById(id).orElseThrow();
    
        List<Pizza> pizzas = pizzaRepository.findAllById(orderDetails.getPizzas()); 
    
        order.setStatus(orderDetails.getStatus());
        order.setNickname(orderDetails.getNickname());
        order.setPizzas(pizzas);
    
        return orderRepository.save(order);
    }
    

    // PUT - Aggiorna lo stato di un ordine
    @PutMapping("/update-status/{id}")
    public Order updateOrderStatus(@PathVariable Long id, @RequestParam Integer status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ordine non trovato con ID: " + id));

        order.setStatus(status);

        return orderRepository.save(order);
    }


    // DELETE - Cancella un ordine
    @DeleteMapping("/{id}")
    public String deleteOrder(@PathVariable Long id) {
        orderRepository.deleteById(id);
        return "Order deleted with ID: " + id;
    }
}

