import { Component, OnInit } from '@angular/core';
import { HostListener } from '@angular/core';
import { Key } from 'ts-keycode-enum';

import { emojis } from './emoji';

@Component({
  selector: 'app-emoji',
  templateUrl: './emoji.component.html',
  styleUrls: ['./emoji.component.css']
})

export class EmojiComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {}

  emojis = emojis;
  lastSearchedEmoji = '';
  autocompleteList;
  listItems;
  listElement;
  searchQuery;
  currentSelection = -1;

  /*
   * Function to copy emoji to clipboard based on emoji name
   */
  copyEmoji(id : string) {
    if (id == "searchedEmoji") {
      id = this.lastSearchedEmoji;
    }
    var button = document.getElementById(id) as HTMLButtonElement;
    let unicode = button.textContent;

    const el = document.createElement('textarea');
    el.value = unicode;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }

  /*
   * Function to search database of emoji's for emoji match based on emoji name
   */
  searchEmoji() {
    var searchEmoji = document.getElementById('searchedEmoji') as HTMLButtonElement;
    var searchTextbox = document.getElementById('searchTextbox') as HTMLInputElement;
    var searchQuery = searchTextbox.value.toLowerCase();

    var foundEmoji = false;
    emojis.forEach(emoji => {
      if (!foundEmoji && searchQuery == emoji.name.toLowerCase()) {
        foundEmoji = true;
        searchEmoji.style.visibility = "visible";
        searchEmoji.disabled = false;
        searchEmoji.textContent = emoji.icon;
        this.lastSearchedEmoji = emoji.name;
      }
    })

    if (!foundEmoji) {
      searchEmoji.textContent = "";
      searchEmoji.disabled = true;
      searchEmoji.style.visibility = "hidden";
    };
    
    searchTextbox.value = null;
  }

    /*
   * Function to clear list of autocomplete items
   */
  closeAllLists(element) {
    var x = document.getElementsByClassName("search-autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (element != x[i] && element != this.searchQuery) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
    this.currentSelection = -1;
  }

  /*
   * Adds query elements to autocomplete list when user types in search box
   */
  @HostListener('document:input', ['$event'])
  handleInputEvent(event: InputEvent) { 
    var searchTextbox = document.getElementById('searchTextbox') as HTMLInputElement;

    this.searchQuery = searchTextbox.value;
    this.closeAllLists(null);
      if (!this.searchQuery) {
        return false;
      }

      this.autocompleteList = document.createElement("DIV");
      this.autocompleteList.setAttribute("id", searchTextbox.id + "search-autocomplete-list");
      this.autocompleteList.setAttribute("class", "search-autocomplete-items");
      this.autocompleteList.setAttribute("style", "width: 60%; margin-top: -10px; margin-bottom: 10px; border: 1px solid #d4d4d4;");

      var anchor = document.getElementById("searchbar");

      anchor.parentNode.appendChild(this.autocompleteList);
      emojis.forEach(emoji => {
        if (emoji.name.substr(0, this.searchQuery.length).toLowerCase() == this.searchQuery.toLowerCase()) {
          this.listElement = document.createElement("DIV");
          this.listElement.setAttribute("style", "padding: 10px; cursor: pointer; background-color: #fff; border-bottom: 1px solid #d4d4d4; font-size: 12px;");
  
          this.listElement.innerHTML = "<strong>" + emoji.name.substr(0, this.searchQuery.length) + "</strong>";
          this.listElement.innerHTML += emoji.name.substr(this.searchQuery.length);

          this.listElement.innerHTML += "<input type='hidden' value='" + emoji.name + "'>";
          this.listElement.addEventListener("click", function(e) {
            searchTextbox.value = this.getElementsByTagName("input")[0].value;
            this.closeAllLists(null);
          });
          this.autocompleteList.appendChild(this.listElement);
        }
      });
  }

  /*
   * Closes and clears autocomplete list when user clicks
   */
  @HostListener('document:click', ['$event'])
  handleClick(event: Event) {
    this.closeAllLists(event.target);
  }

  removeActive() {
    for (var i = 0; i < this.listItems.length; i++) {
      this.listItems[i].setAttribute("style", "padding: 10px; cursor: pointer; background-color: #fff; border-bottom: 1px solid #d4d4d4; font-size: 12px;");
    }
  }

  addActive() {
    if (!this.listItems) {
      return false;
    }
    
    this.removeActive();
    this.listItems[this.currentSelection].setAttribute("style", "padding: 10px; cursor: pointer; background-color: DodgerBlue !important; color: #ffffff; border-bottom: 1px solid #d4d4d4; font-size: 12px;");
  }

  /*
   * Searches for emoji which has been typed in the search bar when enter was clicked
   */
  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.which === Key.Enter) {
      if (this.currentSelection > -1) {
        if (this.listItems) 
          this.listItems[this.currentSelection].click();
      } else {
        this.searchEmoji();
      }
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeydownEvent(event: KeyboardEvent) {
    if (event.which === Key.DownArrow) {
      if (this.autocompleteList) {
        this.listItems = this.autocompleteList.getElementsByTagName("div") as HTMLCollectionOf<HTMLDivElement>;
        this.currentSelection++;
        if (this.currentSelection >= this.listItems.length) {
          this.currentSelection = 0;
        }
        this.addActive();
      }
    }

    if (event.which === Key.UpArrow) {
      if (this.autocompleteList) {
        this.listItems = this.autocompleteList.getElementsByTagName("div") as HTMLCollectionOf<HTMLDivElement>;
        this.currentSelection--;
        if (this.currentSelection < 0) {
          this.currentSelection = (this.listItems.length - 1);
        }
        this.addActive();
      }
    } 
  }

  openTab(category : string) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(category).style.display = "block";
  }

}