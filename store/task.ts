/* eslint-disable @typescript-eslint/no-unused-vars */
import { mutationTree, actionTree } from 'typed-vuex'
import { Task } from '$prisma/client'

export const state = () => ({
  tasks: [] as Task[]
})

export type RootState = ReturnType<typeof state>

export const mutations = mutationTree(state, {
  setTask(state, value: Task[]) {
    state.tasks = value
  }
})

export const actions = actionTree(
  { state, mutations },
  {
    async fetchTasks({ commit }) {
      const res = await this.$api.tasks.$get()
      commit('setTask', res)
    },
    async createTask({ commit }, newLabel: string) {
      if (!newLabel) return
      await this.$api.tasks.post({ body: { label: newLabel } })
    },
    async toggleDone({ commit }, task: Task) {
      await this.$api.tasks
        ._taskId(task.id)
        .patch({ body: { done: !task.done } })
    },
    async deleteTask({ commit }, task: Task) {
      await this.$api.tasks._taskId(task.id).delete()
    }
  }
)
