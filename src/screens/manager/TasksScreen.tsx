import React from 'react';
import {useSelector} from 'react-redux';
import {selectUser} from '../../store/slices/authSlice';
import {useData} from '../../context/DataContext';
import {TaskListScreen} from '../shared/TaskListScreen';

export const TasksScreen: React.FC = () => {
  const user = useSelector(selectUser);
  const {tasks, users, departments} = useData();
  if (!user) return null;

  const dept = departments.find(d => d.managerId === user.id);
  const departmentId = dept?.id ?? user.departmentId ?? departments[0]?.id ?? '';

  const teamTasks = tasks.filter(t => t.departmentId === departmentId);
  const assignable = users.filter(
    u =>
      u.isActive &&
      u.departmentId === departmentId &&
      (u.role === 'employee' || u.role === 'driver'),
  );

  return (
    <TaskListScreen
      title="Tâches de l'équipe"
      tasks={teamTasks}
      assignableUsers={assignable}
      departmentId={departmentId}
      currentUserId={user.id}
      canCreate
      canManage
    />
  );
};
