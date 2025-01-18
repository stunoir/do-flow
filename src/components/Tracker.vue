<script setup>
  import { reactive, ref, onMounted, watch } from 'vue'

  const newTask = ref('')
  const tasks = reactive([])

  // load tasks from localStorage when the component is mounted
  onMounted(() => {
    const storedTasks = localStorage.getItem('user-tasks')
    if (storedTasks) {
      tasks.push(...JSON.parse(storedTasks))
    }
  })

  // watch the tasks array and update localStorage when it changes
  watch(
    tasks,
    (newTasks) => {
      localStorage.setItem('user-tasks', JSON.stringify(newTasks))
    },
    { deep: true } // ensure nested changes in the reactive array are tracked
  )

  const addTask = () => {
    if (newTask.value.trim() !== '') {
      tasks.push(newTask.value)
      newTask.value = ''
    }
  }

  const deleteTask = (idx) => {
    tasks.splice(idx, 1)
  }
</script>

<template>
  <div class="wrapper-section">
    <div class="grid-container">
      <div class="grid-x grid-padding-x align-center">
        <div class="cell medium-6">
          <!-- input form -->
          <form @submit.prevent="addNewTask" class="block-container m-b-2">
            <label>task name</label>
            <div class="flex-input m-t-1">
              <label for="txtTask" class="show-for-sr">Search</label>
              <input v-model="newTask" id="txtTask" type="text" placeholder="Enter a task..." />
              <button @click="addTask" class="btn-action">add</button>
            </div>
          </form>

          <!-- list of tasks -->
          <div class="block-container">
            <h2>all tasks</h2>
            <ul class="tasks-list">
              <li v-for="(task, index) in tasks" :key="task">
                <div class="flex-container flex-gap-20 flex-between">
                  <p>{{ task }}</p>
                  <button @click="deleteTask(index)" class="btn-main btn-main--ghost btn-main--xs">remove</button>
                </div>
              </li>
              <li v-if="tasks.length === 0">
                <p>no tasks added yet...</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .tasks-list {
    list-style: none;
    margin: 0;

    li {
      padding-bottom: 1rem;
      &:not(:last-of-type) {
        margin-block-end: 1rem;
        border-bottom: 1px solid #ffc76d;
      }
    }

    p {
      margin-bottom: 0;
      font-weight: 500;
    }
  }

  .block-container {
    background-color: #fff;
    padding: 1rem;
    border-radius: 6px;
    box-shadow: rgba(100, 100, 111, 0.1) 0px 7px 29px 0px;

    h2,
    label {
      font-size: 2rem;
      line-height: 110%;
      color: #a13f0b;
      font-weight: 200;
    }
  }
</style>
