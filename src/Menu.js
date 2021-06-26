import React, {useState} from 'react';

import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";
import ModalHeader from "react-bootstrap/ModalHeader";
import ModalFooter from "react-bootstrap/ModalFooter";
import ModalTitle from "react-bootstrap/ModalTitle";

import Button from 'react-bootstrap/Button';
 
function Menu(props) {
    const itemNameInput = useFormInput('');
    const priceInput = useFormInput('');
    const idInput = useFormInput('');

    const [show, setShow] = useState(false);
    const [showReview, setShowReview] = useState(false);
    const [action, setAction] = useState('');

    const [reviewDetails, setReviewDetails] = useState({items: []});

    const [selectedQuantities, setSelectedQuantities] = useState({});

  const handleClose = () => setShow(false);

  const handleReviewClose = () => setShowReview(false);


  const handleOpenAddItem = () => {
    itemNameInput.onChange({target : {value: ''}});
    priceInput.onChange({target : {value: '' }});
    idInput.onChange({target : {value: '' }});

    setShow(true);
    setAction('add');
  };

  const handleOpenEditItem = (item) => {
    itemNameInput.onChange({target : {value: item.itemName}});
    priceInput.onChange({target : {value: item.price }});
    idInput.onChange({target : {value: item.id }});

    setShow(true);
    setAction('edit');
  };


  const addItemOnPopup = async () => {
    await props.addItem({itemName: itemNameInput.value, price: priceInput.value, id: null});
    setShow(false);
  }

  const editItemOnPopup = async () => {
    await props.editItem({itemName: itemNameInput.value, price: priceInput.value, id: idInput.value});
    setShow(false);
  }

  const handleDeleteItem = async (item) => {
    await props.deleteItem({id: item.id});
  }

  const handleQuantity = (event, index) => {
    const quantities = JSON.parse(JSON.stringify(selectedQuantities));
    quantities[index] = event.target.value;
    setSelectedQuantities(quantities);
  }

  const handleCheckout = () => {
    console.log(selectedQuantities);
    const selectedItems = [];
    let totalPrice = 0;
    for (let key in selectedQuantities) {
        const item = props.items[key];
        item.quantity = selectedQuantities[key];
        totalPrice += selectedQuantities[key] * props.items[key].price;
        selectedItems.push(item);
    }
    
    setReviewDetails({totalPrice, items: selectedItems});
    setShowReview(true);
  }
 
 
  return (
    <div className="menu-items">
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Price</th>
                    {props.role==='admin' && <th>Action</th>}
                    {props.role==='customer' && <th>Select Quantity to order</th>}
                </tr>
            </thead>
            <tbody>
                {
                    props.items.map((item, index) => {
                        return (
                            <tr>
                                <td>{item.itemName}</td>
                                <td>{item.price} $</td>
                                {props.role==='admin' && <td><a href="javascript:void(0)" onClick={() => handleOpenEditItem(item)}>Edit</a>&nbsp;&nbsp;&nbsp; <a href="javascript:void(0)" onClick={() => handleDeleteItem(item)}>Delete</a></td>}
                                {props.role==='customer' && <td>
                                    <select className="quantity-select" value={selectedQuantities[index]} onChange={(event) => handleQuantity(event, index)}>
                                        <option value={0}>0</option>
                                        <option value={1}>1</option>
                                        <option value={2}>2</option>
                                        <option value={3}>3</option>
                                        <option value={4}>4</option>
                                    </select>
                                </td>}
                            </tr>
                        )
                    })
                }

            </tbody>
        </table>
        <br></br>
        <br></br>
        {
            props.role==='admin' && <div className="add-button">
                <Button variant="info" onClick={handleOpenAddItem}>
                    Add Item
                </Button>
            </div>
        }
        {
            props.role==='customer' && <div className="add-button">
                <Button variant="info" onClick={handleCheckout}>
                    Checkout
                </Button>
            </div>
        }
        

        
        <Modal show={show} onHide={handleClose} animation={false}>
            <ModalHeader>
                <ModalTitle>{action==='add' ? 'Add' : 'Edit'} Item</ModalTitle>
            </ModalHeader>
            <ModalBody>
                <div>
                    Item Name<br />
                    <input type="text" {...itemNameInput} />
                </div>
                <div style={{ marginTop: 10 }}>
                    Price<br />
                    <input type="text" {...priceInput} />
                </div>
            </ModalBody>
            <ModalFooter>
                <Button className="popup-button" variant="light" onClick={handleClose}>
                    Cancel
                </Button>
                {action==='add' ? <Button className="popup-button" variant="primary" onClick={addItemOnPopup}>Add</Button> : 
                <Button className="popup-button" variant="primary" onClick={editItemOnPopup}>Edit</Button>}
                
            </ModalFooter>
        </Modal>

        <Modal show={showReview} onHide={handleReviewClose} animation={false}>
            <ModalHeader>
                <ModalTitle>Review Order</ModalTitle>
            </ModalHeader>
            <ModalBody>
                {reviewDetails.totalPrice ? <table className="order-table">
                    <thead>
                        <tr><th>Item name</th><th >Price</th></tr>
                    </thead>
                    <tbody>
                        {reviewDetails.items.filter(item => item.quantity!=0).map(item => {
                            return (
                                <tr>
                                    <td>{item.itemName}</td>
                                    <td>{item.quantity} x {item.price}$ = {item.quantity*item.price}$</td>
                                </tr>
                            );
                        })}
                        <tr><td><hr></hr></td><td><hr></hr></td></tr>
                        <tr>
                            <td>Total Price: </td>
                            <td>{reviewDetails.totalPrice}$</td>
                        </tr>
                        
                    </tbody>
                </table> : 'Add quantities to place the order'}
            </ModalBody>
            <ModalFooter>
                <Button className="popup-button" variant="light" onClick={handleReviewClose}>
                    Cancel
                </Button>
                <Button disabled={reviewDetails.totalPrice===0} className="popup-button" variant="success" onClick={editItemOnPopup}>Place Order</Button>
                
            </ModalFooter>
        </Modal>
        
        
    </div>
  );
}

const useFormInput = initialValue => {
    const [value, setValue] = useState(initialValue);
   
    const handleChange = e => {
      setValue(e.target.value);
    }
    return {
      value,
      onChange: handleChange
    }
}
 
export default Menu;