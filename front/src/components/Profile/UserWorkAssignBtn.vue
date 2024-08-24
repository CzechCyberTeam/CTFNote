<template>
  <div class="q-gutter-sm">
    <q-btn
      v-touch-hold:2000.mouse="handleCancelWorkAssign"
      :title="onItTitle"
      :icon="onItIcon"
      :color="onItColor"
      size="sm"
      round
      @click="updateWorkAssign(!onIt)"
    >
      <q-tooltip>
        {{ !onIt ? 'Assign' : 'Unassign' }} {{ user?.username }} to this
        task`</q-tooltip
      >
    </q-btn>
  </div>
</template>

<script lang="ts">
import ctfnote from 'src/ctfnote';
import { Ref, defineComponent, reactive, ref } from 'vue';
import { Id, Task, Ctf, User, Profile } from 'src/ctfnote/models';

export default defineComponent({
  props: {
    user: { type: Object as () => Profile, required: true },
    task: { type: Object as () => Task, required: true },
  },
  setup() {
    return {
      workAssign: ctfnote.tasks.useWorkAssign(),
      workUnassign: ctfnote.tasks.useWorkUnassign(),
      cancelWorkAssign: ctfnote.tasks.useCancelWorkAssign(),
    };
  },
  computed: {
    onItColor() {
      return this.onIt ? 'secondary' : 'primary';
    },
    onIt(): boolean {
      if (!this.user?.id) return false;
      return (
        this.task.workOnTasks.filter(
          (w) => w.profileId == this.user?.id && w.active
        ).length > 0
      );
    },
    workedOnIt(): boolean {
      return (
        this.task.workOnTasks.filter((w) => w.profileId == this.user?.id)
          .length > 0
      );
    },
    onItIcon() {
      return this.onIt ? 'person_remove' : 'person_add_alt_1';
    },
    onItTitle() {
      const username = this.user?.username || 'this user';
      return `${!this.onIt ? 'Assign' : 'Unassign'} ${username} to this task`;
    },
  },
  methods: {
    updateWorkAssign(v: boolean) {
      if (v) {
        void this.workAssign(this.task, this.user);
      } else {
        void this.workUnassign(this.task, this.user);
      }
    },
    handleCancelWorkAssign() {
      void this.cancelWorkAssign(this.task, this.user);
    },
  },
});
</script>

<style scoped></style>
