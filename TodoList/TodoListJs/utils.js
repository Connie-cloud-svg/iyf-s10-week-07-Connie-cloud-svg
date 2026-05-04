export function getNextId(/** @type {{id: number}[]} */ tasks) {
    return tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
}
