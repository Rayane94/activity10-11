import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Container, Form, Button } from 'react-bootstrap';

const schema = yup.object().shape({
  name: yup.string()
    .required('Le nom est requis')
    .min(8, 'Minimum 8 caractères')
    .max(15, 'Maximum 15 caractères'),
  dueDate: yup.string()
    .required('La date est requise')
    .matches(/^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/, 'Format jj/mm/AAAA')
    .test('date-not-past', 'La date ne peut être antérieure à aujourd\'hui', value => {
      if (!value) return false;
      const parts = value.split('/');
      const inputDate = new Date(parts[2], parts[1] - 1, parts[0]);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return inputDate >= today;
    }),
  priority: yup.string().oneOf(['Basse', 'Moyenne', 'Elevée'], 'Priorité invalide'),
  isCompleted: yup.boolean(),
});

function TaskFormHookYup() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      dueDate: '',
      priority: 'Basse',
      isCompleted: false,
    }
  });

  const onSubmit = (data) => {
    console.log(data);
    reset();
  };

  return (
    <Container className="my-4">
      <h1>Ajouter une tâche (avec validations)</h1>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="mb-3">
          <Form.Label>Nom</Form.Label>
          <Form.Control type="text" {...register('name')} placeholder="Entrez le nom" />
          {errors.name && <p style={{ color: 'red' }}>{errors.name.message}</p>}
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Date due (jj/mm/AAAA)</Form.Label>
          <Form.Control type="text" {...register('dueDate')} placeholder="jj/mm/AAAA" />
          {errors.dueDate && <p style={{ color: 'red' }}>{errors.dueDate.message}</p>}
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Priorité</Form.Label>
          <Form.Control as="select" {...register('priority')}>
            <option>Basse</option>
            <option>Moyenne</option>
            <option>Elevée</option>
          </Form.Control>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Check type="checkbox" label="Completed" {...register('isCompleted')} />
        </Form.Group>
        <Button variant="primary" type="submit">
          Ajouter tâche
        </Button>
      </Form>
    </Container>
  );
}

export default TaskFormHookYup;
