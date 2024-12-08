import React, { useState, useEffect } from 'react';
import { getAllPizzas, createPizza, updatePizza, deletePizza } from '../services/PizzaService';
import { Grid, Typography } from '@mui/material';
// Import dei nuovi componenti
import AddPizzaForm from './AddPizzaForm';
import PizzaTable from './PizzaTable';
import EditPizzaDialog from './EditPizzaDialog';
import CustomSnackbar from './CustomSnackbar';

const Pizza = () => {
  const [pizzas, setPizzas] = useState([]);
  const [editedPizza, setEditedPizza] = useState(null);
  const [messageInfo, setMessageInfo] = useState({ message: '', severity: 'success' });
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchPizzas = async () => {
      try {
        const data = await getAllPizzas();
        setPizzas(data);
      } catch (error) {
        setMessageInfo({ message: 'Errore durante il recupero delle pizze.', severity: 'error' });
      }
    };
    fetchPizzas();
  }, []);

  const handleCreatePizza = async (description) => {
    if (!description) {
      return;
    }
    const pizza = { description };

    try {
      const createdPizza = await createPizza(pizza);
      setPizzas([...pizzas, createdPizza]);
      setMessageInfo({ message: 'Pizza creata con successo!', severity: 'success' });
    } catch (error) {
      setMessageInfo({ message: 'Errore durante la creazione della pizza.', severity: 'error' });
    }
  };

  const handleUpdatePizza = async (pizza) => {
    if (!pizza.description || !pizza.id) {
      return;
    }

    try {
      const updatedPizza = await updatePizza(pizza.id, { description: pizza.description });
      setPizzas(pizzas.map(p => p.id === updatedPizza.id ? updatedPizza : p));
      setEditedPizza(null);
      setMessageInfo({ message: 'Pizza aggiornata con successo!', severity: 'success' });
      setOpenDialog(false);
    } catch (error) {
      setMessageInfo({ message: 'Errore durante l\'aggiornamento della pizza.', severity: 'error' });
    }
  };

  const handleDeletePizza = async (id) => {
    try {
      await deletePizza(id);
      setPizzas(pizzas.filter(pizza => pizza.id !== id));
      setMessageInfo({ message: 'Pizza eliminata con successo!', severity: 'success' });
    } catch (error) {
      setMessageInfo({ message: 'Errore durante la cancellazione della pizza.', severity: 'error' });
    }
  };

  const handleOpenDialog = (pizza) => {
    setEditedPizza(pizza);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditedPizza(null);
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>Gestione Pizze</Typography>
      <CustomSnackbar messageInfo={messageInfo} onClose={() => setMessageInfo({ message: '', severity: 'success' })} />
      <Grid container spacing={3} direction="column" alignItems="center">
        <Grid item xs={12}>
          <AddPizzaForm onCreatePizza={handleCreatePizza} />
        </Grid>
        <Grid item xs={12}>
          <PizzaTable
            pizzas={pizzas}
            onEditPizza={handleOpenDialog}
            onDeletePizza={handleDeletePizza}
          />
        </Grid>
      </Grid>
      {editedPizza && (
        <EditPizzaDialog
          open={openDialog}
          pizza={editedPizza}
          onClose={handleCloseDialog}
          onUpdatePizza={handleUpdatePizza}
        />
      )}
    </div>
  );
};

export default Pizza;
