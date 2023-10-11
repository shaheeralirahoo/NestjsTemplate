export function findAll() {
  return this.repo.find() || { message: `record does not exsist` };
}
export function findOne(id: number) {
  return this.repo.findOneBy({ id }).then((data) => {
    return data || { message: `id ${id} does not exsist` };
  });
}

