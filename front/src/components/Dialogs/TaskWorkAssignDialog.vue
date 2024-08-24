<template>
  <q-dialog ref="dialogRef" no-backdrop-dismiss @hide="onDialogHide">
    <q-card class="workassign-dialog">
      <q-card-section>
        <div class="row q-gutter-md">
          <div class="text-h6">Users</div>
        </div>
      </q-card-section>

      <q-card-section class="q-pa-none">
        <q-table
          :columns="columns"
          :rows="team"
          hide-pagination
          :pagination="pagination"
        >
          <template #body-cell-username="props">
            <q-td key="username" :props="props">
              <user-badge :profile="props.row" />
            </q-td>
            <q-td key="actions" :props="props" auto-width>
              <user-work-assign-btn :user="props.row" :task="task" />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
      <q-card-actions align="right" class="q-px-md q-pb-md">
        <q-btn v-close-popup flat color="primary" label="Close" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { useDialogPluginComponent } from 'quasar';
import { Task } from 'src/ctfnote/models';
import ctfnote from 'src/ctfnote';
import { defineComponent } from 'vue';
import UserWorkAssignBtn from 'src/components/Profile/UserWorkAssignBtn.vue';
import UserBadge from 'src/components/Profile/UserBadge.vue';

export default defineComponent({
  components: {
    UserWorkAssignBtn,
    UserBadge,
  },
  props: {
    task: { type: Object as () => Task, required: true },
  },
  setup() {
    const { dialogRef, onDialogHide } = useDialogPluginComponent();
    const { result: team } = ctfnote.profiles.getTeam();
    const pagination = {
      rowsPerPage: 0,
    };
    const columns = [
      {
        name: 'username',
        headerStyle: 'col-auto',
        style: 'width: 300px;',
        size: 'auto',
        sortable: true,
        field: 'username',
        label: 'Username',
      },
      {
        name: 'actions',
        headerStyle: 'col-auto',
        field: 'actions',
        label: 'Assign',
        style: 'width: 300px;',
        size: 'auto',
        align: 'right',
      },
    ];
    return { team, columns, dialogRef, onDialogHide, pagination };
  },
});
</script>

<style scoped>
.workassign-dialog {
  width: 600px;
}
</style>
