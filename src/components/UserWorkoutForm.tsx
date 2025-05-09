import { useEffect, useState } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

type Workout = {
  id: string;
  title: string;
};

export default function UserWorkoutForm({
  setShowForm,
  username,
}: {
  setShowForm: (newValue: boolean) => void;
  username: string | undefined;
}) {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [allWorkouts, setAllWorkouts] = useState<Workout[]>([]);
  const location = useLocation();

  const getWorkouts = async () => {
    try {
      const res = await axios.post(
        'https://ftserver-ym6z.onrender.com/getAllWorkOuts',
        {
          username: username,
        }
      );

      const all: Workout[] = res.data.workOuts || [];
      const userWorkouts: Workout[] = location.state || [];

      // تصفية التمارين التي ليست ضمن تمارين المستخدم
      const filteredAllWorkouts = all.filter(
        (workout) => !userWorkouts.some((userWorkout) => userWorkout.id === workout.id)
      );

      setAllWorkouts(filteredAllWorkouts);
      setWorkouts(userWorkouts);
    } catch (err: any) {
      console.error(err.response?.data || err.message);
    }
  };

  const handleSave = async () => {
    try {
      const sendArr: Workout[] = workouts.map((workout) => ({
        id: workout.id,
        title: workout.title,
      }));

      const res = await axios.post(
        'https://ftserver-ym6z.onrender.com/modifyUserWorkout',
        {
          username: username,
          updatedWorkout: {...sendArr},
        }
      );

      if(res.data.success){
        alert('تم تعديل البرامج بنجاح')
        setShowForm(false)
      }
    } catch (err: any) {
      console.error(err.response?.data || err.message);
    }
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const sourceList = source.droppableId === 'user' ? workouts : allWorkouts;
    const destList = destination.droppableId === 'user' ? workouts : allWorkouts;

    const [movedItem] = sourceList.splice(source.index, 1);

    const alreadyExists = destList.some((item) => item.id === movedItem.id);
    if (!alreadyExists) {
      destList.splice(destination.index, 0, movedItem);
    }

    if (source.droppableId === 'user') {
      setWorkouts([...sourceList]);
      setAllWorkouts([...destList]);
    } else {
      setAllWorkouts([...sourceList]);
      setWorkouts([...destList]);
    }
  };

  useEffect(() => {
    getWorkouts();
  }, []);


  return (
    <div className='fixed inset-0 bg-black/60 flex items-center justify-center z-50'>
      <div className='bg-black/70 border border-white/30 rounded-lg p-6 w-3/4 shadow-xl'>
        <div className='flex flex-row-reverse justify-between mb-2'>
          <h2
            dir='rtl'
            className='text-white text-xl font-bold mb-4 text-right'
          >
            البرامج التدريبية للمستخدم
          </h2>

          <button
            className='px-3 bg-red-500/80 rounded'
            onClick={() => setShowForm(false)}
          >
            إغلاق
          </button>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className='grid grid-cols-2 gap-6'>
            {/* User Workouts */}
            <Droppable droppableId='user'>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`min-h-[200px] p-4 border-2 rounded-md transition-colors duration-200 ${
                    snapshot.isDraggingOver
                      ? 'bg-black border-gray-500/20'
                      : 'bg-white/5 border-gray-300/20'
                  }`}
                >
                  <h2 className='font-bold mb-2'>تمارين المستخدم</h2>
                  {workouts.map((workout, index) => (
                    <Draggable key={workout.id} draggableId={workout.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className='bg-gray-100/10 p-2 mb-2 rounded shadow'
                        >
                          {workout.title}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            {/* All Workouts */}
            <Droppable droppableId='all'>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`min-h-[200px] p-4 border-2 rounded-md transition-colors duration-200 ${
                    snapshot.isDraggingOver
                      ? 'bg-black border-gray-500/20'
                      : 'bg-white/5 border-gray-300/20'
                  }`}
                >
                  <h2 className='font-bold mb-2'>جميع التمارين</h2>
                  {allWorkouts.map((workout, index) => (
                    <Draggable key={workout.id} draggableId={workout.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className='bg-gray-100/10 p-2 mb-2 rounded shadow'
                        >
                          {workout.title}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </DragDropContext>

        <button
          className='mt-4 bg-green-600 text-white px-4 py-2 rounded'
          onClick={handleSave}
        >
          حفظ
        </button>
      </div>
    </div>
  );
}
