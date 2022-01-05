
import { gql } from "@apollo/client";

/**
 * Get the current user's information, e.g. how much credit left for this month
 */
export const GET_USER_STATS = gql`
query GetUserStats {
  currentUserContext {
    uid,
    familyName: fieldSsFamilyName,
    creditsRemaining: fieldSsCurrentCredit,
    totalCredits: fieldSsMonthlyCredit,
    numberOfFamilyMembers: fieldSsPersonCount,
  }
}
`

// Get the images of the main product categories
export const GET_PRODUCT_CATEGORIES = gql`
  query GetCategories {
    taxonomyTermQuery(filter: {
    conditions: [
      {operator: EQUAL, field: "vid", value: ["product_categories"]},
    ]}) {
      count
      entities {
        entityId
        entityUuid
        entityLabel
        entityType
        entityUrl {
          path
        }
        ... on TaxonomyTermProductCategories {
          fieldImage {
            derivative(style: PRODUCTCATEGORY) {
              url
              width
              height
            }
            alt
            title
          }
        }
      }
    }
  }
`;

/**
 * Get the products of a category
 * 
 * @param $category the name of the product category
 */ 
export const GET_PRODUCTS_OF_CATEGORY = gql`
  # Get the products in a category
  query GetCategoryProducts($category:String) {
    nodeQuery(filter: {
      conditions: [
        {operator: EQUAL, field: "type", value: ["product"]},
        {operator: EQUAL, field: "field_categories.entity.name", value: [$category]},
      ]}
    ) {
      entities {
        entityUuid
        entityId
        entityLabel
        ... on NodeProduct {
          fieldCategories {
            targetId
            entity {
              name
              entityLabel
            }
          }
          fieldCredit
          fieldExpired
          fieldImage {
            derivative(style: PRODUCTCATEGORY) {
              url
              width
              height
            }
            alt
            title
            width
            height
            url
          }
        }
      }
    }
  }
`;

/**
 * Create an Order
 * 
 * Schema
 * @code
 *   SsOrderCreateInput {
 *     "title" = "String",
 *     "uid" = "Int!",
 *     "fieldStatus" = "String"
 *   }
 * @endcode
 * 
 * Example:
 * @code
 *  {
 *     "order": {
 *       "title": "Some Order",
 *       "uid": 6,
 *       "fieldStatus": "SUBMITTED"
 *     }
 *   }
 * @endcode
 */
export const CREATE_ORDER = gql`
  mutation CreateOrder($order:SsOrderCreateInput!) {
    createOrder(input: $order) {
      errors
      violations {
        code
        message
        path
      }
      entity {
        ... on NodeOrder {
          nid
          title
          fieldStatus {
            entity {
              entityLabel
            }
          }
        }
      }
    }
  } 
`;

/**
 * Update an Order
 * 
 * Types Schema
 * @code
 *   SsOrderUpdateInput {
 *     "title" = "String",
 *     "uid" = "Int!",
 *     "fieldStatus" = "String",
 *     "orderItems" = "[SsOrderItem]"
 *   }
 * 
 *   SsOrderItem {
 *     "productId" = "Int!",
 *     "quantity" = "Float!",
 *   }
 * @endcode
 * 
 * Example Variables
 * @code
 *   {
 *     "id": "15",
 *     "order": {
 *       "title": "Some Order",
 *       "uid": 6,
 *       "fieldStatus": "SUBMITTED",
 *       "orderItems": [
 *          {
 *            "productId": 6,
 *            "quantity": 5.0
 *          },
 *          {
 *            "productId": 7,
 *            "quantity": 2.0
 *          }
 *       ]
 *     }
 *   }
 * @endcode
 */
export const UPDATE_ORDER = gql`
  mutation UpdateOrder($id: String!, $order:SsOrderUpdateInput!) {
    updateOrder(input: $order, id: $id) {
      errors
      violations {
        code
        message
        path
      }
      entity {
        ... on NodeOrder {
          nid
          title
          fieldTotalOrderAmount
          fieldStatus {
            entity {
              entityLabel
            }
          }
          fieldOrderItems {
            entity {
              ... on ParagraphProductItem {
                fieldProduct {
                  entity {
                    ... on NodeProduct {
                      title
                      fieldQuantity
                    }
                  }
                }
                fieldQuantity
              }
            }
          }
        }
      }
    }
  }
`