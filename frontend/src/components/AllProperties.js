import React from "react";
import AddToWishList from "./AddToWishList";
import GoogleMaps from "./GoogleMaps";

export default function AllProperties({ property }) {
  const imagesURL = "http://localhost:5000/property-images/";

  return (
    <div>
      <div></div>
      <div>
        <input type="text" readOnly value={property.name} />
      </div>
      <div className="space-y-4 grid grid-cols-3 bg-pink-500 space-x-5 overflow-x-scroll py-3  ">
        {property.images ? (
          property.images.map((image) => {
            return (
              <div className="w-60 h-60 bg-blue-500 m-4  ">
                <img
                  className="h-52"
                  src={imagesURL + image}
                  alt="Property pic is loading"
                />
              </div>
            );
          })
        ) : (
          <span>No images found</span>
        )}
      </div>
      <div>{property.forSale ? <div>Sale</div> : <div>Rent</div>}</div>
      <div>
        <input type="number" readOnly value={property.price} />
      </div>
      <div>
        <label htmlFor="info">
          Additional Info: <br />
        </label>
        <textarea
          cols={30}
          rows={6}
          className="border-2 rounded-lg focus:outline-none focus:border-blue-600 focus:rounded px-4 "
          type="text"
          value={property.info}
        />
      </div>
      <div>
        <AddToWishList property={property} />
      </div>
      {/* owner section */}

    <div>
        <label htmlFor="name">Owner name</label>
        <input type="text" readOnly value={property.owner.name} />
    </div>
    <div>
        <label htmlFor="email">Owner Email</label>
        <input type="email" readOnly value={property.owner.email} />
    </div>
    <div>
        <label htmlFor="number">Contact No</label>
        <input type="number" readOnly value={property.owner.mobile} />
    </div>



      <div>
        <GoogleMaps center={property.location} />
      </div>
    </div>
  );
}
