import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Container, Form, Button } from 'react-bootstrap';
import './TaskFormHookYup.css';

const schema = yup.object().shape({
  name: yup.string()
    .required('Name is required')
    .min(8, 'Minimum 8 characters')
    .max(15, 'Maximum 15 characters'),
  dueDate: yup.string()
    .required('Date is required')
    .matches(/^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/, 'Format must be dd/mm/yyyy')
    .test('date-not-past', 'Date cannot be in the past', value => {
      if (!value) return false;
      const parts = value.split('/');
      const inputDate = new Date(parts[2], parts[1] - 1, parts[0]);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return inputDate >= today;
    }),
  priority: yup.string().oneOf(['Basse', 'Moyenne', 'Elevée'], 'Invalid priority'),
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
    <Container className="my-container">
      <h1>Add Task (with validations)</h1>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group controlId="taskName" className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" {...register('name')} placeholder="Enter name" />
          {errors.name && <p className="error-message">{errors.name.message}</p>}
        </Form.Group>
        <Form.Group controlId="taskDueDate" className="mb-3">
          <Form.Label>Date due (dd/mm/yyyy)</Form.Label>
          <Form.Control type="text" {...register('dueDate')} placeholder="dd/mm/yyyy" />
          {errors.dueDate && <p className="error-message">{errors.dueDate.message}</p>}
        </Form.Group>
        <Form.Group controlId="taskPriority" className="mb-3">
          <Form.Label>Priority</Form.Label>
          <Form.Control as="select" {...register('priority')}>
            <option>Basse</option>
            <option>Moyenne</option>
            <option>Elevée</option>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="taskIsCompleted" className="mb-3">
          <Form.Check type="checkbox" label="Completed" {...register('isCompleted')} />
        </Form.Group>
        <Button variant="primary" type="submit">Add Task</Button>
      </Form>
    </Container>
  );
}

export default TaskFormHookYup;
