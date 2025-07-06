'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const schema = yup.object().shape({
  nom: yup.string().required('Le nom est requis'),
  prenom: yup.string().required('Le prénom est requis'),
  email: yup.string().email('Email invalide').required('Email requis'),
  password: yup.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères').required('Mot de passe requis'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Les mots de passe ne correspondent pas')
    .required('Confirmation requise'),
  idUtilisateur: yup
    .string()
    .required('Le numéro d\'inscription est requis')
    .matches(/^[0-9]+$/, 'Doit contenir uniquement des chiffres'),
});


type FormData = yup.InferType<typeof schema>;

export default function InscriptionForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {

    const { confirmPassword, ...dataSansConfirm } = data;

  const dataToSend = {
    ...dataSansConfirm,
    role: 'etudiant',
  };

    try {
     const reponse =  await axios.post('http://localhost:4400/signup', {
        ...dataToSend,
      });   
      
  
    
      if ( reponse.data.Error === true ){
        alert(  reponse.data.Message )
        return
      }else{

        router.push('/connexion');
      }
      router.push('/connexion');
    } catch (error) {
      alert('Erreur lors de l’inscription + ' + error );
    }
  };

  return (
    <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Inscription
      </h2>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
          <input
            type="text"
            {...register('nom')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            placeholder="Votre nom"
          />
          <p className="text-sm text-red-500">{errors.nom?.message}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Prenom</label>
          <input
            type="text"
            {...register('prenom')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            placeholder="Votre prénom"
          />
          <p className="text-sm text-red-500">{errors.prenom?.message}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Numéro d'inscription</label>
          <input
            type="text"
            {...register('idUtilisateur')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            placeholder="123456"
          />
          <p className="text-sm text-red-500">{errors.idUtilisateur?.message}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            {...register('email')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            placeholder="Votre email"
          />
          <p className="text-sm text-red-500">{errors.email?.message}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
          <input
            type="password"
            {...register('password')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            placeholder="••••••••"
          />
          <p className="text-sm text-red-500">{errors.password?.message}</p>
        </div>

        <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe</label>
  <input
    type="password"
    {...register('confirmPassword')}
    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
    placeholder="••••••••"
  />
  <p className="text-sm text-red-500">{errors.confirmPassword?.message}</p>
</div>


        <button
          type="submit"
          className="btn btn-sm md:btn-md btn-outline btn-accent w-full"
        >
          Enregistrer
        </button>
        <p className="text-center text-sm text-gray-600">
    Déjà inscrit ?{' '}
    <a href="/connexion" className="text-indigo-600 hover:underline">
      Connectez-vous ici
    </a>
    .
  </p>
      </form>
    </div>
  );
}
