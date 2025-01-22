<script setup>
  import { reactive, ref, onMounted, watch } from 'vue'
  import { useToast } from 'vue-toastification'

  const newTask = ref('')
  const tasks = reactive([])
  const toast = useToast()

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
      toast.info('New task added!', { timeout: 3000 })
    }
  }

  const deleteTask = (idx) => {
    tasks.splice(idx, 1)
    toast.info(`Task #${idx + 1} removed.`, { timeout: 2500 })
  }
</script>

<template>
  <main>
    <div class="wrapper-section">
      <div class="grid-container">
        <div class="grid-x grid-padding-x align-center">
          <div class="cell large-6 medium-8 small-11">
            <!-- input form -->
            <form @submit.prevent="addNewTask" class="block-container block-form m-b-2">
              <label for="txtTask">task name</label>
              <div class="flex-input m-t-1">
                <input autocomplete="off" v-model="newTask" id="txtTask" type="text" placeholder="Enter a task..." />
                <button @click="addTask" class="btn-action">add</button>
              </div>
            </form>

            <!-- list of tasks -->
            <div class="block-container">
              <h2>my tasks</h2>
              <ul class="tasks-list">
                <transition-group name="fade">
                  <li v-for="(task, index) in tasks" :key="task">
                    <div class="flex-container flex-gap-20 flex-between">
                      <p>{{ task }}</p>
                      <button @click="deleteTask(index)" class="btn-main btn-main--ghost btn-main--xs">done</button>
                    </div>
                  </li>
                </transition-group>
                <li v-if="tasks.length === 0">
                  <p>no tasks added yet...</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
  /* Fade transition animation */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  .tasks-list {
    list-style: none;
    margin: 0;

    li {
      background-color: #f9faff;
      padding: 1rem 1.5rem;
      border-radius: 20px;

      &:not(:last-of-type) {
        margin-block-end: 1rem;
      }
    }

    p {
      margin-bottom: 0;
      font-weight: 500;
      color: #1e2c53;
    }
  }

  .block-container {
    background-color: #fff;
    padding: 2rem;
    border-radius: 6px;
    box-shadow: rgba(100, 100, 111, 0.1) 0px 7px 29px 0px;

    h2,
    label {
      font-size: 1.25rem;
      line-height: 110%;
      color: #1e2c53;
      font-weight: 600;
    }
  }

  .block-form {
    container-type: scroll-state;
    position: sticky;
    top: 0;
  }
</style>
