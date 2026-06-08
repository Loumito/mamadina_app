import React from 'react';
import {useSelector} from 'react-redux';
import {selectUser} from '../../store/slices/authSlice';
import {useData} from '../../context/DataContext';
import {TaskListScreen} from '../shared/TaskListScreen';

export const TasksScreen: React.FC = () => {
  const user = useSelector(selectUser);
  const {tasks, users, departments} = useData();
  if (!user) return null;

  const assignable = users.filter(
    u => u.isActive && (u.role === 'employee' || u.role === 'driver'),
  );

  return (
    <TaskListScreen
      title="Gestion des tâches"
      tasks={tasks}
      assignableUsers={assignable}
      departmentId={departments[0]?.id ?? ''}
      currentUserId={user.id}
      canCreate
      canManage
    />
  );
};
