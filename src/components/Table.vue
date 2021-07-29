<template>
    <div class="table">
        <table aria-label="Main Data Table">
            <th id="DateContainer">
                <td is="TableHeader" :content="'123'"></td>
            </th>
            <tr is="TableRow">
                <td is="TableEntry"></td>
            </tr>
        </table>
    </div>
</template>

<script>

export default {
    name: "Table",
}
</script>