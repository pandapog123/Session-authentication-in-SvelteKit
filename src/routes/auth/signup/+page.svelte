<script lang="ts">
  import type { ActionData } from "./$types";

  export let form: ActionData;
</script>

<h1>Sign up</h1>

<form action="/auth/signup" method="POST">
  <input
    type="email"
    name="email"
    placeholder="E-mail"
    value={form?.email ?? ""}
  />

  <input
    type="password"
    name="password"
    placeholder="Password"
    value={form?.password ?? ""}
  />

  <button>Sign up!</button>
</form>

{#if form?.message}
  <div>{form.message}</div>
{/if}
