'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { useRouter } from 'next/navigation';

// Validation schema
const schema = yup.object().shape({
  email: yup.string().email('Email invalide').required('L’email est requis'),
  password: yup.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères').required('Le mot de passe est requis'),
});

type FormData = yup.InferType<typeof schema>;

export default function LoginForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const response = await axios.post('http://localhost:4400/userlogin', data);

      if (response.data.Error === true) {
        alert(response.data.Message);
        return;
      }

      // Stocker le token
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);

      // Redirection en cas de succès

      const role = response.data.role;

      if (role === 'admin') {
      router.push('/admin/livres');
    } else if (role === 'etudiant') {
      router.push('/etudiant/livres');
    } else {
      router.push('/'); // fallback si rôle inconnu
    }
    } catch (error) {
      alert('Erreur lors de la connexion : ' + error);
    }
  };

  return (
    <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Connexion
      </h2>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
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
            placeholder="Votre mot de passe"
          />
          <p className="text-sm text-red-500">{errors.password?.message}</p>
        </div>

        <button
          type="submit"
          className="btn btn-sm md:btn-md btn-outline btn-accent w-full"
        >
          Se connecter
        </button>
        <div className="text-center mt-4">
  <p className="text-sm text-gray-600">
    Pas encore inscrit ?{' '}
    <button
      type="button"
      onClick={() => router.push('/inscription')}
      className="text-indigo-600 hover:underline"
    >
      Créer un compte
    </button>
  </p>
</div>

      </form>
    </div>
  );
}
