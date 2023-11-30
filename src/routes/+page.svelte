<script lang="ts">
  import type { PageData, ActionData } from "./$types";

  export let data: PageData;
</script>

<h1>Session authentication using Svelte</h1>

{#if data.authenticated}
  <form action="?/logout" method="POST">
    <button formaction="?/logout">Log out</button>
  </form>
{:else}
  <a href="/auth/signup">Sign up</a>
  <a href="/auth/login">Log in</a>
{/if}
