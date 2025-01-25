<script setup>
  import { ref, onMounted, watch, computed, nextTick } from 'vue'
  import { useToast } from 'vue-toastification'

  // state
  const newTask = ref('')
  const newTaskCate = ref('work')
  const taskInput = ref(null)
  const tasks = ref([])
  const toast = useToast()

  // load tasks from localStorage
  onMounted(() => {
    const storedTasks = localStorage.getItem('user-tasks')
    if (storedTasks) {
      tasks.value = JSON.parse(storedTasks)
    }
  })

  // watch for changes and update localStorage
  watch(
    tasks,
    (newTasks) => {
      localStorage.setItem('user-tasks', JSON.stringify(newTasks))
    },
    { deep: true }
  )

  // computed: Group tasks by category (sorted Z-A)
  const groupedTasks = computed(() => {
    const grouped = tasks.value.reduce((acc, task) => {
      if (!acc[task.category]) {
        acc[task.category] = []
      }
      acc[task.category].push(task)
      return acc
    }, {})

    return Object.keys(grouped)
      .sort((a, b) => b.localeCompare(a))
      .reduce((sorted, key) => {
        sorted[key] = grouped[key]
        return sorted
      }, {})
  })

  // computed: Count of categories
  const groupCount = computed(() => Object.keys(groupedTasks.value).length)

  // add a new task
  const addTask = async () => {
    if (!newTask.value.trim()) return

    tasks.value.push({
      id: Date.now(), // Ensure unique ID
      title: newTask.value.trim(),
      category: newTaskCate.value
    })

    newTask.value = ''
    newTaskCate.value = 'work'

    toast.info('New task added!', { timeout: 2500 })

    await nextTick() // ensure DOM updates before focusing
    taskInput.value.focus()
  }

  // delete task by ID
  const deleteTask = (id) => {
    tasks.value = tasks.value.filter((task) => task.id !== id)
    toast.info(`Task removed`, { timeout: 2500 })
  }
</script>

<template>
  <main>
    <div class="wrapper-section animated fadeIn">
      <div class="grid-container">
        <!-- form -->
        <div class="grid-x grid-padding-x align-center">
          <div class="cell large-8 small-11">
            <form @submit.prevent="addTask" class="block-container block-form form-general m-b-2">
              <div class="grid-x grid-padding-x">
                <div class="cell medium-6">
                  <label for="txtTask">task title</label>
                  <input
                    ref="taskInput"
                    v-model="newTask"
                    id="txtTask"
                    type="text"
                    placeholder="enter task name..."
                    autocomplete="off"
                  />
                </div>
                <div class="cell medium-6">
                  <label for="ddlCate">category</label>
                  <select v-model="newTaskCate" id="ddlCate">
                    <option value="work">work</option>
                    <option value="personal">personal</option>
                  </select>
                </div>
              </div>
              <button type="submit" class="btn-main btn-main--sm">add new task</button>
            </form>
          </div>
        </div>

        <!-- lists -->
        <div class="grid-x grid-row-gap grid-padding-x align-center">
          <transition-group name="fadeouter">
            <div v-if="groupCount === 0" class="cell small-11 large-8">
              <div class="block-container">
                <p>No tasks to view...</p>
              </div>
            </div>
            <div
              v-else
              v-for="(taskList, category) in groupedTasks"
              :key="category"
              class="cell small-11"
              :class="[groupCount > 1 ? 'large-6' : 'large-8']"
            >
              <div class="block-container" :class="category">
                <h2>{{ category }} task</h2>
                <ul class="tasks-list">
                  <transition-group name="fade">
                    <li v-for="task in taskList" :key="task.id">
                      <div class="flex-container flex-gap-20 flex-between">
                        <p>{{ task.title }}</p>
                        <button @click="deleteTask(task.id)" class="btn-main btn-main--xs">done</button>
                      </div>
                    </li>
                  </transition-group>
                </ul>
              </div>
            </div>
          </transition-group>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
  /* transition animations */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  .fadeouter-enter-active,
  .fadeouter-leave-active {
    transition: opacity 0 ease;
  }
  .fadeouter-enter-from,
  .fadeouter-leave-to {
    opacity: 0;
  }

  .tasks-list {
    list-style: none;
    margin: 0;

    li {
      background-color: rgba(98, 155, 248, 0.1);
      padding: 1rem 1.5rem;
      border-radius: 10px;
      text-transform: lowercase;

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
    box-shadow: rgba(98, 155, 248, 0.2) 0px 7px 29px 0px;

    h2,
    label {
      font-size: 1.25rem;
      line-height: 110%;
      color: #1e2c53;
      font-weight: 600;
    }
    p {
      margin-bottom: 0;
      font-weight: 500;
      color: #1e2c53;
    }

    &.personal {
      box-shadow: rgba(203, 85, 224, 0.2) 0px 7px 29px 0px;

      li {
        background-color: rgba(203, 85, 224, 0.1);
      }
    }
  }

  .block-form {
    container-type: scroll-state;
    position: sticky;
    top: 0;

    input:not(.btn-main):not(.btn),
    select {
      border-color: rgba(30, 44, 83, 0.5);
      color: #1e2c53;

      &::placeholder {
        color: #1e2c53;
        transition: color 0.3s;
      }

      &:focus {
        &::placeholder {
          color: transparent;
        }
      }
    }
  }
</style>
