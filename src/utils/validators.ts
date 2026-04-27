import * as Yup from 'yup';

export const emailValidator = Yup.string()
  .email('Email invalide')
  .required('Email requis');

export const passwordValidator = Yup.string()
  .min(6, 'Le mot de passe doit contenir au moins 6 caractères')
  .required('Mot de passe requis');

export const phoneValidator = Yup.string()
  .matches(/^[0-9]{10}$/, 'Numéro de téléphone invalide (10 chiffres)')
  .required('Téléphone requis');

export const loginSchema = Yup.object().shape({
  email: emailValidator,
  password: passwordValidator,
});

export const createUserSchema = Yup.object().shape({
  email: emailValidator,
  password: passwordValidator,
  firstName: Yup.string().required('Prénom requis'),
  lastName: Yup.string().required('Nom requis'),
  phone: phoneValidator,
  role: Yup.string()
    .oneOf(['admin', 'manager', 'employee', 'driver'])
    .required('Rôle requis'),
});

export const createTaskSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, 'Le titre doit contenir au moins 3 caractères')
    .required('Titre requis'),
  description: Yup.string().required('Description requise'),
  priority: Yup.string()
    .oneOf(['low', 'medium', 'high', 'urgent'])
    .required('Priorité requise'),
  assignedTo: Yup.array()
    .of(Yup.string())
    .min(1, 'Au moins un utilisateur doit être assigné')
    .required('Assignation requise'),
  dueDate: Yup.date()
    .min(new Date(), 'La date d\'échéance doit être dans le futur')
    .required('Date d\'échéance requise'),
});

export const createVehicleSchema = Yup.object().shape({
  licensePlate: Yup.string().required('Plaque d\'immatriculation requise'),
  model: Yup.string().required('Modèle requis'),
  brand: Yup.string().required('Marque requise'),
  year: Yup.number()
    .min(1990, 'Année invalide')
    .max(new Date().getFullYear() + 1, 'Année invalide')
    .required('Année requise'),
  mileage: Yup.number().min(0, 'Kilométrage invalide').required('Kilométrage requis'),
});

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone);
};
