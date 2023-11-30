<script lang="ts">
  import type { PageData } from "./$types";

  export let data: PageData;
</script>

<h1>Session authentication using Svelte</h1>

<!-- Steps 1 and 2 -->
<!-- <a href="/auth/signup">Sign up</a>
<a href="/auth/login">Log in</a> -->

<!-- Step 3 -->
{#if data.authenticated}
  <form action="?/logout" method="POST">
    <button formaction="?/logout">Log out</button>
  </form>
{:else}
  <a href="/auth/signup">Sign up</a>
  <a href="/auth/login">Log in</a>
{/if}
