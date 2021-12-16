import { useParams } from 'react-router-dom'

const CategoryTemp = () => {
  const { categorySlug } = useParams();

  return (
    <div>
      <h2>Category Temp Page</h2>
      <p>The slug is: <strong>{categorySlug}</strong></p>
    </div>
  );
}

export default CategoryTemp;