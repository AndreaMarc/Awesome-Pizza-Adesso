import React, { useState, useEffect } from 'react';
import { getOrders, updateOrderDetails, createOrder, deleteOrder } from '../services/OrderService'
import { getAllPizzas } from '../services/PizzaService';
import { TextField, Button, Grid, Typography, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, FormControl, InputLabel, Select, MenuItem, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Chip } from '@mui/material';
import { Alert } from '@mui/material';

// Extract status labels into a constant
const STATUS_LABELS = {
  1: 'In elaborazione',
  2: 'In attesa',
  3: 'Evaso'
};

const Order = () => {
  // Consolidate related state variables
  const [orderState, setOrderState] = useState({
    orders: [],
    nickname: '',
    status: '',
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

  const getStatusLabel = (status) => STATUS_LABELS[status] || 'Status sconosciuto';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setOrderState(prev => ({ ...prev, loading: true }));
        const [orderData, pizzaData] = await Promise.all([getOrders(), getAllPizzas()]);
        setOrderState(prev => ({ ...prev, orders: orderData, pizzas: pizzaData, loading: false }));
      } catch (error) {
        setOrderState(prev => ({ ...prev, message: 'Errore durante il recupero dei dati.', openSnackbar: true, loading: false }));
      }
    };
    fetchData();
  }, []);

  const handleDeleteOrder = async (orderId) => {
    try {
      await deleteOrder(orderId);
      setOrderState(prev => ({
        ...prev,
        orders: prev.orders.filter(order => order.id !== orderId),
        message: 'Ordine eliminato con successo!',
        openSnackbar: true
      }));
    } catch (error) {
      setOrderState(prev => ({ ...prev, message: 'Errore durante l\'eliminazione dell\'ordine.', openSnackbar: true }));
    }
  };

  const handleOpenModal = (order) => {
    const pizzaNamesList = order.pizzas.map(pizza => pizza.description);
    setOrderState(prev => ({
      ...prev,
      selectedOrder: order,
      nickname: order.nickname,
      status: order.status,
      selectedPizzas: pizzaNamesList,
      openModal: true
    }));
  };

  const handleCloseModal = () => {
    setOrderState(prev => ({
      ...prev,
      openModal: false,
      selectedOrder: null,
      nickname: '',
      status: '',
      selectedPizzas: []
    }));
  };

  const handleAddPizza = (pizzaId) => {
    const pizza = orderState.pizzas.find(pizza => pizza.id === pizzaId);
    if (pizza && !orderState.selectedPizzas.includes(pizza.description)) {
      setOrderState(prev => ({ ...prev, selectedPizzas: [...prev.selectedPizzas, pizza.description] }));
    }
  };

  const handleRemovePizza = (pizzaName) => {
    setOrderState(prev => ({ ...prev, selectedPizzas: prev.selectedPizzas.filter(pizza => pizza !== pizzaName) }));
  };

  const handleSaveChanges = async () => {
    if (!orderState.nickname || !orderState.status || orderState.selectedPizzas.length === 0) {
      setOrderState(prev => ({ ...prev, message: 'Compila tutti i campi per aggiornare l\'ordine.', openSnackbar: true }));
      return;
    }

    const pizzaIds = orderState.pizzas
      .filter(pizza => orderState.selectedPizzas.includes(pizza.description))
      .map(pizza => pizza.id);

    const updatedOrder = {
      ...orderState.selectedOrder,
      nickname: orderState.nickname,
      status: orderState.status,
      pizzas: pizzaIds, 
    };

    try {
      const savedOrder = await updateOrderDetails(orderState.selectedOrder.id, updatedOrder);
      setOrderState(prev => ({
        ...prev,
        orders: prev.orders.map(order => (order.id === savedOrder.id ? savedOrder : order)),
        message: 'Ordine aggiornato con successo!',
        openSnackbar: true
      }));
      handleCloseModal();
    } catch (error) {
      setOrderState(prev => ({ ...prev, message: 'Errore durante l\'aggiornamento dell\'ordine.', openSnackbar: true }));
    }
  };

  const handleCreateOrder = async () => {
    if (!orderState.nickname || !orderState.status || orderState.selectedPizzas.length === 0) {
      setOrderState(prev => ({ ...prev, message: 'Compila tutti i campi per creare un ordine.', openSnackbar: true }));
      return;
    }
  
    const pizzaIds = orderState.pizzas
      .filter(pizza => orderState.selectedPizzas.includes(pizza.description))
      .map(pizza => pizza.id);
  
    if (pizzaIds.length !== orderState.selectedPizzas.length) {
      setOrderState(prev => ({ ...prev, message: 'Alcuni nomi delle pizze non sono validi.', openSnackbar: true }));
      return;
    }
  
    try {
      const newOrder = {
        nickname: orderState.nickname,
        status: orderState.status,
        pizzaIds,
      };
      const createdOrder = await createOrder(newOrder);
      setOrderState(prev => ({
        ...prev,
        orders: [...prev.orders, createdOrder],
        message: 'Ordine creato con successo!',
        openSnackbar: true
      }));
    } catch (error) {
      setOrderState(prev => ({ ...prev, message: 'Errore durante la creazione dell\'ordine.', openSnackbar: true }));
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>Gestione Ordini</Typography>

      {/* Snackbar per messaggi di errore o successo */}
      <Snackbar open={orderState.openSnackbar} autoHideDuration={6000} onClose={() => setOrderState(prev => ({ ...prev, openSnackbar: false }))}>
        <Alert onClose={() => setOrderState(prev => ({ ...prev, openSnackbar: false }))} severity={orderState.message.includes("Errore") ? "error" : "success"}>
          {orderState.message}
        </Alert>
      </Snackbar>

      <TableContainer component={Paper} sx={{ marginTop: 4, maxWidth: '80%', marginLeft: 'auto', marginRight: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID Ordine</TableCell>
              <TableCell>Nickname</TableCell>
              <TableCell>Status</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orderState.orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.nickname}</TableCell>
                <TableCell>{getStatusLabel(order.status)}</TableCell>
                <TableCell>
                  <Button variant="outlined" color="secondary" onClick={() => handleOpenModal(order)}>
                    Modifica
                  </Button>
                  <Button variant="outlined" color="error" onClick={() => handleDeleteOrder(order.id)} style={{ marginLeft: 8 }}>
                    Elimina
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {orderState.loading && <CircularProgress sx={{ position: 'absolute', top: '50%', left: '50%' }} />}
      </TableContainer>

      <Dialog open={orderState.openModal} onClose={handleCloseModal}>
        <DialogTitle>Modifica Ordine</DialogTitle>
        <DialogContent>
          {orderState.selectedOrder && (
            <div>
              <TextField
                label="Nickname"
                variant="outlined"
                value={orderState.nickname}
                onChange={(e) => setOrderState(prev => ({ ...prev, nickname: e.target.value }))}
                fullWidth
                margin="normal"
              />
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Status</InputLabel>
                <Select
                  value={orderState.status}
                  onChange={(e) => setOrderState(prev => ({ ...prev, status: e.target.value }))}
                  label="Status"
                >
                  <MenuItem value={1}>In elaborazione</MenuItem>
                  <MenuItem value={2}>Completato</MenuItem>
                  <MenuItem value={3}>Annullato</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel>Pizze</InputLabel>
                <Select
                  value=""
                  onChange={(e) => handleAddPizza(e.target.value)}
                  label="Seleziona Pizze"
                >
                  {orderState.pizzas.map((pizza) => (
                    <MenuItem key={pizza.id} value={pizza.id}>{pizza.description}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <div style={{ marginTop: 10 }}>
                {orderState.selectedPizzas.map((pizzaName, index) => (
                  <Chip
                    key={index}
                    label={pizzaName}
                    onDelete={() => handleRemovePizza(pizzaName)}
                    style={{ marginRight: 8, marginBottom: 8 }}
                  />
                ))}
              </div>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Annulla
          </Button>
          <Button onClick={handleSaveChanges} color="secondary">
            Salva modifiche
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Order;
