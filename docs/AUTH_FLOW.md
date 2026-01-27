# Authentication Flow Documentation

Ce document explique le système d'authentification d'Indeen.

## 1. Architecture

### Stack technique

- **Frontend**: Next.js 16 (App Router)
- **Auth Provider**: Supabase Auth
- **Backend**: NestJS (API REST)
- **State Management**: Zustand avec persistence localStorage

### Composants clés

```
src/
├── lib/
│   ├── supabase/
│   │   ├── client.ts      # Client browser Supabase
│   │   └── server.ts      # Client serveur Supabase
│   ├── api/
│   │   └── client.ts      # Client API avec intercepteur auth
│   ├── auth-errors.ts     # Traduction des erreurs
│   └── validations/
│       └── auth.ts        # Schémas Zod
├── stores/
│   └── auth-store.ts      # Store Zustand
├── hooks/
│   └── use-auth.ts        # Hook principal auth
├── providers/
│   └── auth-provider.tsx  # Provider React
├── components/auth/
│   ├── AuthGuard.tsx      # Protection de composants
│   ├── AuthLoader.tsx     # Loader plein écran
│   ├── LogoutDialog.tsx   # Dialog confirmation
│   └── ProtectedRoute.tsx # Protection de pages
└── middleware.ts          # Protection routes (serveur)
```

## 2. Flow d'inscription (Signup)

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Signup    │────>│   Supabase   │────>│   Backend   │
│    Page     │     │    Auth      │     │   /signup   │
└─────────────┘     └──────────────┘     └─────────────┘
       │                   │                    │
       │                   │                    │
       ▼                   ▼                    ▼
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  Formulaire │     │ Crée user    │     │ Crée profil │
│  validé Zod │     │ + envoie     │     │ complet     │
│             │     │ email verif  │     │             │
└─────────────┘     └──────────────┘     └─────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │ User clique  │
                    │ lien email   │
                    └──────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │ /auth/callback│
                    │ échange code │
                    └──────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  Dashboard   │
                    └──────────────┘
```

### Étapes détaillées

1. L'utilisateur remplit le formulaire d'inscription
2. Validation côté client avec Zod (signupSchema)
3. `supabase.auth.signUp()` crée l'utilisateur dans Supabase
4. `POST /auth/signup` crée le profil complet dans le backend
5. Supabase envoie un email de vérification
6. L'utilisateur clique sur le lien dans l'email
7. Redirection vers `/auth/callback` qui échange le code
8. Redirection vers le dashboard

## 3. Flow de connexion (Login)

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Login     │────>│   Supabase   │────>│   Backend   │
│    Page     │     │    Auth      │     │  /users/:id │
└─────────────┘     └──────────────┘     └─────────────┘
       │                   │                    │
       ▼                   ▼                    ▼
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  Credentials│     │ Vérifie +    │     │ Retourne    │
│  validés    │     │ crée session │     │ profil      │
└─────────────┘     └──────────────┘     └─────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │ Redirect     │
                    │ selon rôle   │
                    └──────────────┘
```

### Redirections selon le rôle

| Rôle    | Destination       |
|---------|-------------------|
| MENTOR  | /dashboard        |
| MENTEE  | /mentors          |
| ADMIN   | /admin            |

Si un `redirectTo` est présent dans l'URL, il a priorité.

## 4. Flow de réinitialisation de mot de passe

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Reset     │────>│   Supabase   │────>│   Email     │
│  Password   │     │    Auth      │     │   envoyé    │
└─────────────┘     └──────────────┘     └─────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │ /auth/callback│
                    │ + session    │
                    └──────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │ /update-     │
                    │ password     │
                    └──────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │   Login      │
                    └──────────────┘
```

## 5. Gestion des rôles

### Types de rôles

```typescript
type UserRole = 'MENTOR' | 'MENTEE' | 'ADMIN' | 'PARENT';
```

### Vérification des rôles

```tsx
// Avec AuthGuard (composants)
<AuthGuard requiredRole="MENTOR">
  <MentorDashboard />
</AuthGuard>

// Avec ProtectedRoute (pages)
<ProtectedRoute requiredRole={['MENTOR', 'ADMIN']}>
  <AdminPage />
</ProtectedRoute>

// Avec useAuth (programmatiqu)
const { isMentor, isMentee, isAdmin } = useAuth();
if (isMentor) {
  // ...
}
```

## 6. Protection des routes

### Middleware (côté serveur)

Le middleware (`src/middleware.ts`) protège les routes côté serveur :

```typescript
// Routes protégées
const protectedRoutes = [
  '/dashboard',
  '/sessions',
  '/profil',
  '/onboarding',
];

// Si pas de session → redirect /login?redirectTo=...
// Si authentifié sur /login → redirect /dashboard
```

### AuthGuard (côté client)

Pour protéger des composants spécifiques :

```tsx
<AuthGuard requiredRole="MENTOR" fallback={<LoginPrompt />}>
  <SensitiveContent />
</AuthGuard>
```

### ProtectedRoute (pages complètes)

Pour protéger des pages entières :

```tsx
export default function DashboardPage() {
  return (
    <ProtectedRoute requiredRole="MENTOR">
      <Dashboard />
    </ProtectedRoute>
  );
}
```

## 7. Troubleshooting

### L'utilisateur est déconnecté automatiquement

**Causes possibles :**
- Token expiré et refresh échoué
- Cookies supprimés/bloqués
- Session invalide côté Supabase

**Solution :**
Le hook `useAuth` vérifie et refresh automatiquement la session toutes les 4 minutes.

### Erreur "Email not confirmed"

**Cause :**
L'utilisateur n'a pas cliqué sur le lien de vérification.

**Solution :**
1. Vérifier le dossier spam
2. Utiliser le bouton "Renvoyer l'email" sur `/verify-email`

### Erreur "Invalid login credentials"

**Cause :**
Email ou mot de passe incorrect.

**Solution :**
1. Vérifier l'orthographe de l'email
2. Utiliser "Mot de passe oublié" si nécessaire

### La page protégée s'affiche brièvement avant redirect

**Cause :**
Le middleware s'exécute côté serveur mais le state est hydraté côté client.

**Solution :**
Utiliser `<ProtectedRoute>` qui affiche un loader pendant la vérification.

### Les toasts ne s'affichent pas

**Cause :**
Le composant `<Toaster>` n'est pas dans le layout.

**Solution :**
Vérifier que `<Toaster />` est présent dans `src/app/layout.tsx`.

## 8. Variables d'environnement

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 9. Testing checklist

- [ ] Signup → Email vérification → Login
- [ ] Login avec mauvais credentials → erreur claire
- [ ] Reset password → email → nouveau password → login
- [ ] Accès route protégée sans auth → redirect login
- [ ] Login → redirect vers page demandée (redirectTo)
- [ ] Logout → confirmation → session cleared
- [ ] Refresh page → session persiste
- [ ] Pas de flash de contenu non autorisé
- [ ] Loading states sur toutes les actions
- [ ] Messages d'erreur en français
- [ ] Responsive sur mobile
