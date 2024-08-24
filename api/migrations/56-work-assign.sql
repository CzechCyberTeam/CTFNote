CREATE OR REPLACE FUNCTION ctfnote.work_assign (task_id int, profile_id int)
  RETURNS ctfnote.work_on_task
  AS $$
  WITH inserted AS (
    INSERT INTO ctfnote.work_on_task (task_id, profile_id, active)
      VALUES (work_assign.task_id, work_assign.profile_id, TRUE)
      ON CONFLICT (task_id, profile_id) DO UPDATE
        SET active = TRUE
      RETURNING
        *
  )
  SELECT * FROM inserted;

$$
LANGUAGE SQL;

CREATE OR REPLACE FUNCTION ctfnote.work_unassign (task_id int, profile_id int)
  RETURNS ctfnote.work_on_task
  AS $$
  UPDATE ctfnote.work_on_task
    SET active = FALSE
  WHERE work_on_task.task_id = work_unassign.task_id
    AND profile_id = work_unassign.profile_id
  RETURNING
    *;

$$
LANGUAGE SQL;

CREATE OR REPLACE FUNCTION ctfnote.cancel_work_assign (task_id int, profile_id int)
  RETURNS ctfnote.work_on_task
  AS $$
  DELETE FROM ctfnote.work_on_task
  WHERE work_on_task.task_id = cancel_work_assign.task_id
    AND profile_id = cancel_work_assign.profile_id
  RETURNING
    *;
$$
LANGUAGE SQL;

GRANT EXECUTE ON FUNCTION ctfnote.work_assign (int, int) TO user_manager;
GRANT EXECUTE ON FUNCTION ctfnote.work_unassign (int, int) TO user_manager;
GRANT EXECUTE ON FUNCTION ctfnote.cancel_work_assign (int, int) TO user_manager;
