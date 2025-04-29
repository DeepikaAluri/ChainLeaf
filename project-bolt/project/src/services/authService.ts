import { mockUsers } from '../data/mockData';

// In a real app, this would be an API call
export const loginUser = async (email: string, password: string) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // First check mock users
      const mockUser = mockUsers.find(
        (u) => u.email === email && u.password === password
      );

      // Then check localStorage users
      const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const localUser = storedUsers.find(
        (u: any) => u.email === email && u.password === password
      );

      const user = mockUser || localUser;

      if (user) {
        // Store user in localStorage (except password)
        const { password: _, ...userWithoutPassword } = user;
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        resolve(userWithoutPassword);
      } else {
        reject(new Error('Invalid email or password'));
      }
    }, 500); // Simulate API delay
  });
};

export const logoutUser = () => {
  localStorage.removeItem('user');
};

export const getCurrentUser = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const userString = localStorage.getItem('user');
      if (userString) {
        resolve(JSON.parse(userString));
      } else {
        resolve(null);
      }
    }, 300);
  });
};

export const registerUser = async (userData: any) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        // Check if email exists in mock users
        if (mockUsers.some(u => u.email === userData.email)) {
          reject(new Error('Email already registered'));
          return;
        }

        // Check if email exists in localStorage users
        const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
        if (storedUsers.some((u: any) => u.email === userData.email)) {
          reject(new Error('Email already registered'));
          return;
        }

        // Add new user to stored users
        storedUsers.push({
          name: userData.name,
          email: userData.email,
          password: userData.password,
          role: userData.role
        });
        localStorage.setItem('users', JSON.stringify(storedUsers));

        // Set current user
        const { password: _, ...userWithoutPassword } = userData;
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        resolve({ success: true });
      } catch (error) {
        reject(error);
      }
    }, 500);
  });
};

interface User {
  name: string;
  email: string;
  role: string;
  password?: string;
}

interface UpdateUserData {
  name: string;
  email: string;
  currentPassword?: string;
  newPassword?: string;
}

export const updateUserProfile = async (data: UpdateUserData) => {
  const users = JSON.parse(localStorage.getItem('users') || '[]') as User[];
  const currentUser = await getCurrentUser() as User;

  if (!currentUser) {
    throw new Error('No user is currently logged in');
  }

  // Find the user in the stored users
  const userIndex = users.findIndex((u) => u.email === currentUser.email);
  if (userIndex === -1) {
    throw new Error('User not found');
  }

  // If changing password, verify current password
  if (data.currentPassword && data.newPassword) {
    if (users[userIndex].password !== data.currentPassword) {
      throw new Error('Current password is incorrect');
    }
    users[userIndex].password = data.newPassword;
  }

  // Update user information
  users[userIndex].name = data.name;
  users[userIndex].email = data.email;

  // Save updated users to localStorage
  localStorage.setItem('users', JSON.stringify(users));

  // Update current user in localStorage
  const updatedUser: User = {
    name: data.name,
    email: data.email,
    role: users[userIndex].role
  };
  localStorage.setItem('currentUser', JSON.stringify(updatedUser));

  return updatedUser;
};