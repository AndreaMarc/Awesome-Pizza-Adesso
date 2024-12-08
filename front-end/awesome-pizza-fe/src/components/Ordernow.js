import React, { useState, useEffect } from 'react';
import { getOrders, updateOrderDetails, createOrder, deleteOrder } from '../services/OrderService'
import { getAllPizzas } from '../services/PizzaService';
import { TextField, Button, Grid, Typography, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, FormControl, InputLabel, Select, MenuItem, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Chip } from '@mui/material';
import { Alert } from '@mui/material';
import OrderForm from './OrderForm'; // Added import for OrderForm

const Ordernow = () => {
  // Consolidated state variables
  const [orderState, setOrderState] = useState({
    orders: [],
    nickname: '',
    status: 2,
    selectedPizzas: [],
    selectedOrderId: null,
    selectedOrder: null,
    loading: false,
    openSnackbar: false,
    message: '',
    openModal: false,
    openCreateModal: false,
    pizzas: []
  });

  const getStatusLabel = (status) => {
    switch(status) {
      case 1:
        return 'In elaborazione';
      case 2:
        return 'In attesa';
      case 3:
        return 'Evaso';
      default:
        return 'Status sconosciuto';
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setOrderState(prevState => ({ ...prevState, loading: true }));
        const [orderData, pizzaData] = await Promise.all([getOrders(), getAllPizzas()]);
        setOrderState(prevState => ({
          ...prevState,
          orders: orderData,
          pizzas: pizzaData,
          loading: false
        }));
      } catch (error) {
        setOrderState(prevState => ({
          ...prevState,
          message: 'Errore durante il recupero dei dati.',
          openSnackbar: true,
          loading: false
        }));
      }
    };
    fetchData();
  }, []);

  const handleDeleteOrder = async (orderId) => {
    try {
      await deleteOrder(orderId);
      setOrderState(prevState => ({
        ...prevState,
        orders: prevState.orders.filter(order => order.id !== orderId),
        message: 'Ordine eliminato con successo!',
        openSnackbar: true
      }));
    } catch (error) {
      setOrderState(prevState => ({
        ...prevState,
        message: 'Errore durante l\'eliminazione dell\'ordine.',
        openSnackbar: true
      }));
    }
  };

  const handleOpenModal = (order) => {
    const pizzaNamesList = order.pizzas.map(pizza => pizza.description);
    setOrderState(prevState => ({
      ...prevState,
      selectedOrder: order,
      nickname: order.nickname,
      status: order.status,
      selectedPizzas: pizzaNamesList,
      openModal: true
    }));
  };

  const handleCloseModal = () => {
    setOrderState(prevState => ({
      ...prevState,
      openModal: false,
      selectedOrder: null,
      nickname: '',
      status: '2',
      selectedPizzas: []
    }));
  };

  const handleOpenCreateModal = () => {
    setOrderState(prevState => ({
      ...prevState,
      openCreateModal: true,
      nickname: '',
      status: '2',
      selectedPizzas: []
    }));
  };

  const handleCloseCreateModal = () => {
    setOrderState(prevState => ({
      ...prevState,
      openCreateModal: false
    }));
  };

  const handleAddPizza = (pizzaId) => {
    const pizza = orderState.pizzas.find(pizza => pizza.id === pizzaId);
    if(pizza) {
      console.log(orderState.selectedPizzas);
    setOrderState(prevState => ({
      ...prevState,
      selectedPizzas: [...prevState.selectedPizzas, pizza.description]
    }));
  }
  };






  const handleRemovePizza = (pizzaName) => {
    let index = orderState.selectedPizzas.findIndex(o => o === pizzaName);
    orderState.selectedPizzas.splice(index, 1);
    setOrderState(prevState => ({
      ...prevState,
      selectedPizzas: [...prevState.selectedPizzas]
    }));
  };

  const handleCreateOrder = async () => {
    if (!orderState.nickname || !orderState.status || orderState.selectedPizzas.length === 0) {
      setOrderState(prevState => ({
        ...prevState,
        message: 'Compila tutti i campi per creare un ordine.',
        openSnackbar: true
      }));
      return;
    }
  
  

    const pizzaIds = orderState.selectedPizzas.map(pizzaName => {
      const pizza = orderState.pizzas.find(p => p.description === pizzaName);
      return pizza ? pizza.id : null;
    }).filter(id => id !== null);
  
    if (pizzaIds.length !== orderState.selectedPizzas.length) {
      setOrderState(prevState => ({
        ...prevState,
        message: 'Alcuni nomi delle pizze non sono validi.',
        openSnackbar: true
      }));
      return;
    }
  
    try {
      const newOrder = {
        nickname: orderState.nickname,
        status: orderState.status,
        pizzaIds,
      };
      const createdOrder = await createOrder(newOrder);
      setOrderState(prevState => ({
        ...prevState,
        orders: [...prevState.orders, createdOrder],
        message: 'Ordine creato con successo!',
        openSnackbar: true
      }));
      handleCloseCreateModal();
    } catch (error) {
      setOrderState(prevState => ({
        ...prevState,
        message: 'Errore durante la creazione dell\'ordine.',
        openSnackbar: true
      }));
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>Gestione Ordini</Typography>

      {/* Snackbar per messaggi di errore o successo */}
      <Snackbar open={orderState.openSnackbar} autoHideDuration={6000} onClose={() => setOrderState(prevState => ({ ...prevState, openSnackbar: false }))}>
        <Alert onClose={() => setOrderState(prevState => ({ ...prevState, openSnackbar: false }))} severity={orderState.message.includes("Errore") ? "error" : "success"}>
          {orderState.message}
        </Alert>
      </Snackbar>

      <Button variant="contained" color="primary" onClick={handleOpenCreateModal}>
        Aggiungi Nuovo Ordine
      </Button>

      <OrderForm
        open={orderState.openCreateModal}
        onClose={() => setOrderState({ ...orderState, openCreateModal: false })}
        onCreate={handleCreateOrder}
        nickname={orderState.nickname}
        setNickname={(nickname) => setOrderState({ ...orderState, nickname })}
        status={orderState.status}
        setStatus={(status) => setOrderState({ ...orderState, status })}
        pizzas={orderState.pizzas}
        selectedPizzas={orderState.selectedPizzas}
        handleAddPizza={handleAddPizza}
        handleRemovePizza={handleRemovePizza}
      />
    </div>
  );
};

export default Ordernow;
