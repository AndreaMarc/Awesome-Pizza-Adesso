
import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography } from '@mui/material';

const PizzaTable = ({ pizzas, onEditPizza, onDeletePizza }) => {
  return (
    <div>
      <Typography variant="h6">Lista delle Pizze</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Descrizione</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pizzas.map((pizza) => (
              <TableRow key={pizza.id}>
                <TableCell>{pizza.description}</TableCell>
                <TableCell align="right">
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => onEditPizza(pizza)}
                    sx={{ marginRight: 1 }}
                  >
                    Modifica
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => onDeletePizza(pizza.id)}
                  >
                    Elimina
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default PizzaTable;